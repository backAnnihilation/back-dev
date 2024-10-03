import {
  EVENT_COMMANDS,
  ImageCategory,
  IMAGES_COMPLETED,
  ImageSize,
  LayerNoticeInterceptor,
  EventType,
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
import { ProfilesRepository } from '../../infrastructure/profiles-image.repository';
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

export class UploadProfileImageCommand {
  constructor(public imageDto: InputProfileImageDto) {}
}

@CommandHandler(UploadProfileImageCommand)
export class UploadProfileImageUseCase
  implements ICommandHandler<UploadProfileImageCommand>
{
  constructor(
    private filesService: FilesService,
    private filesRepo: ProfilesRepository<ProfileImageDocument>,
    @InjectModel(ProfileImageMeta.name)
    private ProfileImageModel: ProfileImageModel,
    @InjectModel(OutboxEntity.name)
    private OutboxModel: OutboxModel,
    private commandBus: CommandBus,
    private rmqAdapter: RmqAdapter,
    private outboxRepo: OutboxRepository,
    private outboxService: OutboxService,
  ) {}

  async execute(
    command: UploadProfileImageCommand,
  ): Promise<LayerNoticeInterceptor> {
    const { profileId, image } = command.imageDto;
    const { originalname, size, mimetype } = image;

    const eventType = IMAGES_COMPLETED;

    const initOutboxInstance = this.OutboxModel.makeInstance({
      eventType,
    });
    const outbox = await this.outboxRepo.save(initOutboxInstance);

    const processingCommand = new ProcessingImageCommand(image);
    const processedImages = await this.commandBus.execute<
      ProcessingImageCommand,
      Map<ImageSize, Buffer>
    >(processingCommand);

    const category = ImageCategory.PROFILE;
    const bucket = Bucket.Inst;

    const imageUrls = {};

    let originalImageMetaId: string;
    for (const [type, buffer] of processedImages.entries()) {
      const { url, id: storageId } =
        await this.filesService.uploadFileInStorage({
          image: { buffer, mimetype, originalname },
          bucket,
          category,
          profileId,
        });
      imageUrls[type] = url;
      const createdImageNotice = await this.ProfileImageModel.makeInstance<
        ProfileImageMetaDto,
        ProfileImageMeta
      >({
        storageId,
        category,
        name: originalname,
        size,
        url,
        profileId,
        sizeType: type,
      });
      if (createdImageNotice.hasError)
        return createdImageNotice as LayerNoticeInterceptor;

      const profileImageDto = createdImageNotice.data;
      const result = await this.filesRepo.save(profileImageDto);
      type === ImageSize.ORIGINAL && (originalImageMetaId = result.id);
    }

    const payload = {
      urlOriginal: imageUrls[ImageSize.ORIGINAL],
      urlSmall: imageUrls[ImageSize.SMALL],
      urlLarge: imageUrls[ImageSize.LARGE],
      profileId,
    };

    outbox.update(EventStatus.AWAITING_DELIVERY, payload);
    await this.outboxRepo.save(outbox);

    const event = new ProcessedProfileImagesEvent(outbox);

    await this.rmqAdapter.sendMessage(eventType, event);

    this.addScheduleJob();

    return new LayerNoticeInterceptor();
  }

  private async addScheduleJob() {
    this.outboxService.initJob({
      name: 'outbox-events',
      start: 5000,
      end: 26000,
    });
  }
}
