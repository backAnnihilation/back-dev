import {
  BaseImageResponse,
  LayerNoticeInterceptor,
  POST_IMAGE_UPLOAD,
} from '@app/shared';
import { Transactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { CommandHandler } from '@nestjs/cqrs';
import { Transport } from '@nestjs/microservices';
import { BaseUseCase } from '../../../../core/application/use-cases/base-use-case';
import { TransportManager } from '../../../../core/managers/transport.manager';
import { ICreatePostCommand } from '../../api/models/input/create-post.model';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { CreatePostDTO } from '../dto/create-post.dto';
import { ProfilesRepository } from '../../../profile/infrastructure/profiles.repository';

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
export class CreatePostUseCase extends BaseUseCase<
  CreatePostCommand,
  ResponsePostType
> {
  private location = this.constructor.name;
  constructor(
    private postsRepo: PostsRepository,
    private profilesRepo: ProfilesRepository,
    private transportManager: TransportManager<ResponseTransportType>,
  ) {
    super();
  }

  // @Transactional<TransactionalAdapterPrisma>()
  async onExecute(
    command: CreatePostCommand,
  ): Promise<LayerNoticeInterceptor<ResponsePostType>> {
    {
      const notice = new LayerNoticeInterceptor<ResponsePostType>();

      const { userId, description, image } = command.postDto;

      const profileExists = await this.profilesRepo.getByUserId(userId);
      if (!profileExists) {
        notice.addError(
          `Profile with id ${userId} not found`,
          this.location,
          notice.errorCodes.ResourceNotFound,
        );
        return notice;
      }

      const postDto = new CreatePostDTO({
        description,
        userId,
      });

      const savedPost = await this.postsRepo.save(postDto);
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
