import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { OutputId } from '../../../../../../../libs/shared/models/output-id.dto';
import {
  GetErrors,
  LayerNoticeInterceptor,
} from '../../../../../../../libs/shared/notification';
import { UsersRepository } from '../../../admin/infrastructure/users.repo';
import { ProfilesRepository } from '../../infrastructure/profiles.repository';
import { IEditPostCommand } from '../../api/models/input/edit-profile.model';
import { PostsRepository } from '../../../admin/infrastructure/posts.repo';
import { EditUserPostDTO } from '../dto/edit-post.dto'; 
('../../api/models/input-models/fill-profile.model');

export class EditPostCommand {
  constructor(public postDto: IEditPostCommand) {}
}

@CommandHandler(EditPostCommand)
export class EditPostUseCase
  implements ICommandHandler<EditPostCommand>
{
  private location = this.constructor.name;
  constructor(
    private userRepo: UsersRepository,
    private postRepo: PostsRepository,
    // private profilesRepo: ProfilesRepository,
  ) {}

  async execute(
    command: EditPostCommand,
  ): Promise<LayerNoticeInterceptor<OutputId>> {
    let notice = new LayerNoticeInterceptor<null | OutputId>();

    const { userId, description, postId } = command.postDto;

    const  post = await this.postRepo.getPostById(postId);
    const  postUserId = post.id;

    if (postUserId !== userId){
      notice.addError(
        'denied of access to post',
      );
      return notice;
    }

    const postDto = new EditUserPostDTO({
      ...command.postDto,
    });

    const result = await this.postRepo.saveEntity(
      "userProfile",
      // "userPost",
      postDto,
    );

    notice.addData({ id: result.id });
    return notice;
  }
}
