import {
  ImageCategory,
  ImageSize,
  LayerNoticeInterceptor,
  OutputIdAndUrl,
} from '@app/shared';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Bucket } from '../../api/models/enums/file-models.enum';
import { InputPostImageDto } from '../../api/models/input-models/post-image.model';
import {
  PostImageMeta,
  PostImageMetaDocument,
  PostImageMetaDto,
  PostImageMetaModel,
} from '../../domain/entities/post-image-meta.schema';
import { PostsRepository } from '../../infrastructure/post-files.repository';
import { FilesService } from '../services/file-metadata.service';

export class UploadPostImageCommand {
  constructor(public imageDto: InputPostImageDto) {}
}

@CommandHandler(UploadPostImageCommand)
export class UploadPostImageUseCase
  implements ICommandHandler<UploadPostImageCommand>
{
  constructor(
    private filesService: FilesService,
    private filesRepo: PostsRepository<PostImageMetaDocument>,
    @InjectModel(PostImageMeta.name) private PostImageModel: PostImageMetaModel,
  ) {

  }

  async execute(
    command: UploadPostImageCommand,
  ): Promise<LayerNoticeInterceptor<OutputIdAndUrl>> {
    const notice = new LayerNoticeInterceptor()
    notice.validateFields
    const { userId, image, postId } = command.imageDto;
    const { originalname, size } = image;

    const { url, id: storageId } = await this.filesService.uploadFileInStorage({
      image,
      bucket: Bucket.Inst,
      category: ImageCategory.POST,
      postId,
    });

    const createdPostImageNotice = await this.PostImageModel.makeInstance<
      PostImageMetaDto,
      PostImageMeta
    >({
      userId,
      storageId,
      category: ImageCategory.POST,
      name: originalname,
      size,
      url,
      postId,
      sizeType: ImageSize.ORIGINAL
    });

    if (createdPostImageNotice.hasError)
      return createdPostImageNotice as LayerNoticeInterceptor;

    const postImageDto = createdPostImageNotice.data;
    const savedPostImageId = await this.filesRepo.save(postImageDto);

    const result = { id: savedPostImageId.id, url };
    return new LayerNoticeInterceptor(result);
  }
}
