import {
  BaseImageResponse,
  LayerNoticeInterceptor,
  POST_IMAGE_UPLOAD,
} from '@app/shared';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Transport } from '@nestjs/microservices';
import { TransportManager } from '../../../../core/managers/transport.manager';
import { ICreatePostCommand } from '../../api/models/input/create-post.model';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { CreatePostDTO } from '../dto/create-post.dto';

type ResponseTransportType = BaseImageResponse & {
  postId: string;
  imageId: string;
};
type ResponsePostType = {
  id: string;
};

export class CreatePostCommand {
  constructor(public postDto: ICreatePostCommand) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<CreatePostCommand> {
  private location = this.constructor.name;
  constructor(
    private postsRepo: PostsRepository,
    private transportManager: TransportManager<ResponseTransportType>,
  ) {}

  async execute(
    command: CreatePostCommand,
  ): Promise<LayerNoticeInterceptor<ResponsePostType>> {
    {
      const notice = new LayerNoticeInterceptor<ResponsePostType>();

      const { userId, description, image } = command.postDto;

      const postDto = new CreatePostDTO({
        description,
        userId,
      });

      const savedPost = await this.postsRepo.saveEntity(postDto);
      const postId = savedPost.id;

      const postImage = await this.postsRepo.saveImage({ postId });
      const imageId = postImage.id;
      await this.postsRepo.update(postId, { imageId });

      const payload = {
        image,
        postId,
        imageId,
      };

      const result = await this.transportManager.sendMessage({
        transport: Transport.TCP,
        command: POST_IMAGE_UPLOAD,
        payload,
        async: false,
      });

      if (!result) {
        notice.addError(
          `Image wasn't uploaded`,
          this.location,
          notice.errorCodes.UnavailableServiceError,
        );
        return notice;
      }
      const { imageMetaId, urls } = result;

      await this.postsRepo.updateImage(imageId, {
        imageMetaId,
        urlOriginal: urls.urlOriginal,
        urlSmall: urls.urlSmall,
      });

      notice.addData({ id: postId });
      return notice;
    }
  }
}
