import {
  EVENT_COMMANDS,
  ImageCategory,
  IMAGES_COMPLETED,
  ImageSize,
  LayerNoticeInterceptor,
  EventType,
  IMAGES_PROCESSED,
} from '@app/shared';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { RmqAdapter } from '@file/core/adapters/rmq.adapter';
import { ProcessingImageCommand } from '../../../fileProcessing/application/use-cases/processing-images.use-case';
import { Bucket } from '../../api/models/enums/file-models.enum';
import { InputProfileImageDto } from '../../api/models/input-models/profile-image.model';
import {
  ProfileImageDocument,
  ProfileImageMeta,
  ProfileImageMetaDto,
  ProfileImageModel,
} from '../../domain/entities/user-profile-image-meta.schema';
import { FilesService } from '../services/file-metadata.service';
import {
  OutboxDocument,
  OutboxEntity,
  OutboxModel,
  EventStatus,
} from '../../domain/entities/outbox.schema';
import { OutboxRepository } from '../../infrastructure/events.outbox.repository';
import { ProcessedProfileImagesEvent } from '../../api/models/dto/processed-profile-images-event';
import { OutboxService } from '../services/schedule/outbox.service';
import { ProfilesRepository } from '../../infrastructure/profiles-image.repository';
import { BaseImageMeta } from '../../domain/entities/base-image-meta.schema';

export class UploadProfileImageCommand {
  constructor(public imageDto: InputProfileImageDto) {}
}

@CommandHandler(UploadProfileImageCommand)
export class UploadProfileImageUseCase
  implements ICommandHandler<UploadProfileImageCommand>
{
  private readonly eventType: EVENT_COMMANDS;
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
    this.eventType = IMAGES_PROCESSED;
  }

  async execute(
    command: UploadProfileImageCommand,
  ): Promise<LayerNoticeInterceptor> {
    const { profileId, imageId, image } = command.imageDto;
    const { originalname, size, mimetype } = image;

    const outboxEvent = await this.outboxRepo.getEventByImageId(imageId);
    if (outboxEvent) {
      this.rmqAdapter.sendMessage(this.eventType, outboxEvent);
      return;
    }

    const initOutboxInstance = this.OutboxModel.makeInstance({
      eventType: this.eventType,
    });
    const outbox = await this.outboxRepo.save(initOutboxInstance);

    const processingCommand = new ProcessingImageCommand(image);
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
    const savedEvent = await this.outboxRepo.save(outbox);

    const event = new ProcessedProfileImagesEvent(outbox);
    await this.rmqAdapter.sendMessage(this.eventType, event);

    this.checkEventDeliveredJob(imageId, savedEvent.id);

    return new LayerNoticeInterceptor();
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
