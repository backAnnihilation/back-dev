import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LayerNoticeInterceptor, OutputId } from '@app/shared';
import { IDeletePostCommand } from '../../api/models/input/delete-post.model';
import { UsersRepository } from '../../../admin/infrastructure/users.repository';
import { PostsRepository } from '../../infrastructure/posts.repository';

export class DeletePostCommand {
  constructor(public deleteDto: IDeletePostCommand) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostUseCase implements ICommandHandler<DeletePostCommand> {
  private location = this.constructor.name;
  constructor(private postsRepo: PostsRepository) {}

  async execute(
    command: DeletePostCommand,
  ): Promise<LayerNoticeInterceptor<OutputId>> {
    const notice = new LayerNoticeInterceptor<null | OutputId>();
    const { userId, postId } = command.deleteDto;

    const post = await this.postsRepo.getById(postId);

    if (!post) {
      notice.addError(
        `post with id ${postId} not found`,
        this.location,
        notice.errorCodes.ResourceNotFound,
      );
      return notice;
    }

    if (post.userId !== userId) {
      notice.addError(
        `User with id ${userId} is not the owner of the post`,
        this.location,
        notice.errorCodes.AccessForbidden,
      );
      return notice;
    }
    await this.postsRepo.delete(postId);

    return notice;
  }
}
