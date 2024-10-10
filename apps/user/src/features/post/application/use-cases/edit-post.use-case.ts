import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { IEditPostCommand } from '../../api/models/input/edit-profile.model';
import { OutputId, LayerNoticeInterceptor } from '@app/shared';

export class EditPostCommand {
  constructor(public postDto: IEditPostCommand) {}
}

@CommandHandler(EditPostCommand)
export class EditPostUseCase implements ICommandHandler<EditPostCommand> {
  private location = this.constructor.name;
  constructor(private postRepo: PostsRepository) {}

  async execute(
    command: EditPostCommand,
  ): Promise<LayerNoticeInterceptor<OutputId>> {
    const notice = new LayerNoticeInterceptor<null | OutputId>();
    const { userId, postId } = command.postDto;
    const post = await this.postRepo.getPostById(postId);
    if (post.userId !== userId) {
      notice.addError(
        'User is not the owner of the post',
        this.location,
        notice.errorCodes.AccessForbidden,
      );
      return notice;
    }
    await this.postRepo.update(command.postDto);

    return notice;
  }
}
