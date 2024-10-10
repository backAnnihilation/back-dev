import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LayerNoticeInterceptor, OutputId } from '@app/shared';
import { IDeletePostCommand } from '../../api/models/input/delete-profile.model';
import { UsersRepository } from '../../../admin/infrastructure/users.repository';
import { PostsRepository } from '../../infrastructure/posts.repository';

export class DeletePostCommand {
  constructor(public deleteDto: IDeletePostCommand) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostUseCase implements ICommandHandler<DeletePostCommand> {
  private location = this.constructor.name;
  // constructor(private profilesRepo: ProfilesRepository) {}
  constructor(
    private postsRepository: PostsRepository,
    private userRepo: UsersRepository,
    private postRepo: PostsRepository,
  ) {}

  async execute(
    command: DeletePostCommand,
  ): Promise<LayerNoticeInterceptor<OutputId>> {
    const notice = new LayerNoticeInterceptor<null | OutputId>();

    const { userId, postId } = command.deleteDto;

    const post = await this.postRepo.getPostById(postId);

    if (!post) {
      notice.addError(
        'not found post with id: ' + postId,
        this.location,
        notice.errorCodes.ResourceNotFound,
      );
      return notice;
    }

    if (post.userId !== userId) {
      notice.addError(
        'User is not the owner of the post',
        this.location,
        notice.errorCodes.AccessForbidden,
      );
      return notice;
    }
    await this.postRepo.deletePost(post.id);

    return notice;
  }
}
