import {
  EVENT_COMMANDS,
  EventType,
  FileMetadata,
  ImageCategory,
  IMAGES_PROCESSED,
  ImageSize,
  LayerNoticeInterceptor,
  OutputIdAndUrl,
  POST_IMAGES_PROCESSED,
} from '@app/shared';
import {
  CommandBus,
  CommandHandler,
  EventBus,
  ICommandHandler,
} from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Bucket } from '../../api/models/enums/file-models.enum';
import { InputPostImageDto } from '../../api/models/input-models/post-image.model';
import {
  PostImageMeta,
  PostImageMetaModel,
} from '../../domain/entities/post-image-meta.schema';
import { PostsRepository } from '../../infrastructure/post-files.repository';
import { FilesService } from '../services/file-metadata.service';
import { OutboxRepository } from '../../infrastructure/events.outbox.repository';
import { OutboxService } from '../services/schedule/outbox.service';
import { RmqAdapter } from '@file/core/adapters/rmq.adapter';
import { OutboxEntity, OutboxModel } from '../../domain/entities/outbox.schema';
import imageSizes from '@file/core/utils/image-sizes';
import { ProcessingImageCommand } from '../../../fileProcessing/application/use-cases/processing-images.use-case';
const postImageSizes = imageSizes.post;

type ResponsePostImagesType = {
  urls: {
    urlOriginal: string;
    urlSmall: string;
  };
  imageId: string;
  postId: string;
  imageMetaId: string;
};

export class UploadPostImageCommand {
  constructor(public imageDto: InputPostImageDto) {}
}

@CommandHandler(UploadPostImageCommand)
export class UploadPostImageUseCase
  implements ICommandHandler<UploadPostImageCommand>
{
  private readonly eventType: EventType;
  private readonly commandType: EVENT_COMMANDS;
  private readonly category: ImageCategory;
  private readonly bucket: Bucket;
  constructor(
    private filesService: FilesService,
    private filesRepo: PostsRepository,
    private outboxRepo: OutboxRepository,
    private outboxService: OutboxService,
    private rmqAdapter: RmqAdapter,
    @InjectModel(OutboxEntity.name)
    private OutboxModel: OutboxModel,
    private eventBus: EventBus,
    private commandBus: CommandBus,

    @InjectModel(PostImageMeta.name) private PostImageModel: PostImageMetaModel,
  ) {
    this.eventType = EventType.POST_IMAGES;
    this.commandType = POST_IMAGES_PROCESSED;
    this.category = ImageCategory.POST;
    this.bucket = Bucket.Inst;
  }

  async execute(
    command: UploadPostImageCommand,
  ): Promise<LayerNoticeInterceptor<ResponsePostImagesType>> {
    const notice = new LayerNoticeInterceptor<ResponsePostImagesType>();
    notice.validateEntity;
    const { category, bucket } = this;
    const { imageId, image, postId } = command.imageDto;
    const { originalname, size, mimetype, buffer } = image;

    // const outboxEvent = await this.outboxRepo.getEventByImageId(imageId);
    // if (outboxEvent) {
    //   this.rmqAdapter.sendMessage(this.commandType, outboxEvent);
    //   return notice;
    // }

    // const initOutboxInstance = this.OutboxModel.makeInstance({
    //   eventType: this.eventType,
    //   imageId,
    // });
    // const outbox = await this.outboxRepo.save(initOutboxInstance);

    const processingCommand = new ProcessingImageCommand({
      buffer,
      imageSizes: postImageSizes,
    });
    const processedImages = await this.commandBus.execute<
      ProcessingImageCommand,
      Map<ImageSize, Buffer>
    >(processingCommand);

    const imageMeta = {};
    const imagesMeta = [];
    for (const [type, buffer] of processedImages.entries()) {
      const { url, id: storageId } =
        await this.filesService.uploadFileInStorage({
          image: { buffer, mimetype, originalname },
          bucket,
          category,
          postId,
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

    const createdPostImageNotice = await this.PostImageModel.makeInstance({
      imageId,
      postId,
      imagesMeta,
    });

    if (createdPostImageNotice.hasError)
      return createdPostImageNotice as LayerNoticeInterceptor;

    const savedImage = await this.filesRepo.save(createdPostImageNotice.data);

    const payload = {
      urls: {
        urlOriginal: imageMeta[ImageSize.ORIGINAL].url,
        urlSmall: imageMeta[ImageSize.SMALL].url,
      },
      imageId,
      postId,
      imageMetaId: savedImage.id,
    };

    // this.processImagesAndSaveInStorage({})
    //   .then(() => {
    //     const event = new ProcessImagesAndNotify(outbox, savedPostImage.id);
    //     this.eventBus.publish(event);
    //   })
    //   .catch((error) => {
    //     console.error('Error processing additional image sizes:', error);
    //   });

    notice.addData(payload);
    return notice;
  }

  // private async processImagesAndSaveInStorage(dto: InputFileDtoType) {
  //   const { image, imageId, postId } = dto;

  //   const { url, id: storageId } = await this.filesService.uploadFileInStorage({
  //     image,
  //     bucket: Bucket.Inst,
  //     category: ImageCategory.POST,
  //     postId,
  //   });
  // }
}

type InputFileDtoType = {
  image: FileMetadata;
  postId: string;
  imageId: string;
};
