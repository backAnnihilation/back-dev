import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { OutputId } from '../../../../../../../libs/shared/models/output-id.dto';
import {
  GetErrors,
  LayerNoticeInterceptor,
} from '../../../../../../../libs/shared/notification';
import { UsersRepository } from '../../../admin/infrastructure/users.repo';
import { PostsRepository } from '../../infrastructure/posts.repo';
import { IEditPostCommand } from '../../api/models/input/edit-profile.model';
('../../api/models/input-models/fill-profile.model');

export class EditPostCommand {
  constructor(public postDto: IEditPostCommand) {}
}

@CommandHandler(EditPostCommand)
export class EditPostUseCase implements ICommandHandler<EditPostCommand> {
  private location = this.constructor.name;
  constructor(
    private userRepo: UsersRepository,
    private postRepo: PostsRepository,
    // private profilesRepo: ProfilesRepository,
  ) {}

  async execute(
    command: EditPostCommand,
  ): Promise<LayerNoticeInterceptor<OutputId>> {
    const notice = new LayerNoticeInterceptor<null | OutputId>();
    const { userId, postId } = command.postDto;
    const post = await this.postRepo.getPostById(postId);
    if (post.userId !== userId) {
      notice.addError(
        'User is not the owner of the post',
        null,
        GetErrors.Forbidden,
      );
      return notice;
    }
    await this.postRepo.update(command.postDto);

    return notice;
  }
}
