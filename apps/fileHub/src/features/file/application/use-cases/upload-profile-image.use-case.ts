import {
  EVENT_COMMANDS,
  EventType,
  ImageCategory,
  IMAGES_PROCESSED,
  ImageSize,
  LayerNoticeInterceptor,
  PROFILE_IMAGES_PROCESSED,
} from '@app/shared';
import { RmqAdapter } from '@file/core/adapters/rmq.adapter';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { ProcessingImageCommand } from '../../../fileProcessing/application/use-cases/processing-images.use-case';
import { ProcessedProfileImagesEvent } from '../../api/models/dto/processed-profile-images-event';
import { Bucket } from '../../api/models/enums/file-models.enum';
import { InputProfileImageDto } from '../../api/models/input-models/profile-image.model';
import {
  EventStatus,
  OutboxDocument,
  OutboxEntity,
  OutboxModel,
} from '../../domain/entities/outbox.schema';
import {
  ProfileImageMeta,
  ProfileImageModel,
} from '../../domain/entities/user-profile-image-meta.schema';
import { OutboxRepository } from '../../infrastructure/events.outbox.repository';
import { ProfilesRepository } from '../../infrastructure/profiles-image.repository';
import { FilesService } from '../services/file-metadata.service';
import { OutboxService } from '../services/schedule/outbox.service';
import imageSizes from '@file/core/utils/image-sizes';
const profileImageSizes = imageSizes.profile;

export class UploadProfileImageCommand {
  constructor(public imageDto: InputProfileImageDto) {}
}

@CommandHandler(UploadProfileImageCommand)
export class UploadProfileImageUseCase
  implements ICommandHandler<UploadProfileImageCommand>
{
  private readonly eventType: EventType;
  private readonly commandType: EVENT_COMMANDS;
  constructor(
    private filesService: FilesService,
    private filesRepo: ProfilesRepository,
    @InjectModel(ProfileImageMeta.name)
    private ProfileImageModel: ProfileImageModel,
    @InjectModel(OutboxEntity.name)
    private OutboxModel: OutboxModel,
    private commandBus: CommandBus,
    private rmqAdapter: RmqAdapter,
    private outboxRepo: OutboxRepository,
    private outboxService: OutboxService,
  ) {
    this.eventType = EventType.PROFILE_IMAGES;
    this.commandType = PROFILE_IMAGES_PROCESSED;
  }

  async execute(
    command: UploadProfileImageCommand,
  ): Promise<LayerNoticeInterceptor> {
    const notice = new LayerNoticeInterceptor();

    const { profileId, imageId, image } = command.imageDto;
    const { originalname, size, mimetype, buffer } = image;

    const outboxEvent = await this.outboxRepo.getEventByImageId(imageId);
    if (outboxEvent) {
      this.rmqAdapter.sendMessage(this.commandType, outboxEvent);
      return notice;
    }

    const initOutboxInstance = this.OutboxModel.makeInstance({
      eventType: this.eventType,
      imageId,
    });
    const outbox = await this.outboxRepo.save(initOutboxInstance);

    const processingCommand = new ProcessingImageCommand({
      buffer,
      imageSizes: profileImageSizes,
    });
    const processedImages = await this.commandBus.execute<
      ProcessingImageCommand,
      Map<ImageSize, Buffer>
    >(processingCommand);

    const category = ImageCategory.PROFILE;
    const bucket = Bucket.Inst;

    const imageMeta = {};
    const imagesMeta = [];
    for (const [type, buffer] of processedImages.entries()) {
      const { url, id: storageId } =
        await this.filesService.uploadFileInStorage({
          image: { buffer, mimetype, originalname },
          bucket,
          category,
          profileId,
          imageId,
        });
      imageMeta[type] = {
        url,
        storageId,
        name: originalname,
        category,
        size,
        sizeType: type,
      };
      imagesMeta.push(imageMeta[type]);
    }

    const createdImageNotice = await this.ProfileImageModel.makeInstance({
      profileId,
      imageId,
      imagesMeta,
    });

    if (createdImageNotice.hasError)
      return createdImageNotice as LayerNoticeInterceptor;

    const savedImage = await this.filesRepo.save(createdImageNotice.data);

    const payload = {
      urlOriginal: imageMeta[ImageSize.ORIGINAL].url,
      urlSmall: imageMeta[ImageSize.SMALL].url,
      urlLarge: imageMeta[ImageSize.LARGE].url,
      profileId,
      imageId,
      imageMetaId: savedImage.id,
    };

    outbox.update(EventStatus.AWAITING_DELIVERY, payload);
    const savedOutbox = await this.outboxRepo.save(outbox);

    await this.sendProcessedImagesPayload(savedOutbox);

    this.checkEventDeliveredJob(imageId, savedOutbox.id);

    return notice;
  }

  private async sendProcessedImagesPayload(outbox: OutboxDocument) {
    const event = new ProcessedProfileImagesEvent(outbox);
    await this.rmqAdapter.sendMessage(this.commandType, event);
  }

  private async checkEventDeliveredJob(imageId: string, eventId: string) {
    this.outboxService.initIntervalJob({
      name: `profile-image-event-${imageId}`,
      start: 4000,
      end: 15000,
      entityId: eventId,
    });
  }
}
