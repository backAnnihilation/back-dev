import {
  EVENT_COMMANDS,
  ImageType,
  LayerNoticeInterceptor,
  MediaType,
  OutputId,
} from '@app/shared';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TransportManager } from '@user/core/managers/transport.manager';
import { ICreatePostCommand } from '../../api/models/input/create-post.model';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { CreatePostDTO } from '../dto/create-post.dto';
import { Transport } from '@nestjs/microservices';

export class CreatePostCommand {
  constructor(public postDto: ICreatePostCommand) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<CreatePostCommand> {
  private location = this.constructor.name;
  constructor(
    private postRepo: PostsRepository,
    private transportManager: TransportManager,
  ) {}

  async execute(
    command: CreatePostCommand,
  ): Promise<LayerNoticeInterceptor<OutputId>> {
    {
      const notice = new LayerNoticeInterceptor<OutputId>();

      const { userId, description, image } = command.postDto;

      const imagePayload = {
        fileFormat: MediaType.IMAGE,
        fileType: ImageType.MAIN,
        image,
        userId,
      };

      const commandName = EVENT_COMMANDS.POST_CREATED;
      const transport = Transport.TCP;
      const result = await this.transportManager.sendMessage(
        transport,
        commandName,
        imagePayload,
      );

      if (!result) {
        notice.addError(
          `Image wasn't uploaded`,
          this.location,
          notice.errorCodes.InternalServerError,
        );
        return notice;
      }

      const postDto = new CreatePostDTO({
        description,
        userId,
        imageUrl: result.url,
        imageId: result.postId,
      });

      await this.postRepo.create(postDto);

      return notice;
    }
  }
}
