import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { OutputId } from '../../../../../../../libs/shared/models/output-id.dto';
import {
  GetErrors,
  LayerNoticeInterceptor,
} from '../../../../../../../libs/shared/notification';
// import { IEditPostCommand } from '../../api/models/input/edit-profile.model';
// import { ProfilesRepository } from '../../infrastructure/profiles.repository';
import { IDeletePostCommand } from '../../api/models/input/delete-profile.model';
// import { PostsRepository } from '../../../admin/infrastructure/posts.repo';
import { UsersRepository } from '../../../admin/infrastructure/users.repo';
import { PostsRepository } from '../../infrastructure/posts.repo';
('../../api/models/input-models/fill-profile.model');

export class DeletePostCommand {
  constructor(public deleteDto: IDeletePostCommand) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostUseCase implements ICommandHandler<DeletePostCommand> {
  private location = this.constructor.name;
  // constructor(private profilesRepo: ProfilesRepository) {}
  constructor(
    // private postsRepository: PostsRepository,
    // private userRepo: UsersRepository,
    private postRepo: PostsRepository,
  ) {}

  async execute(
    command: DeletePostCommand,
  ): Promise<LayerNoticeInterceptor<OutputId>> {
    let notice = new LayerNoticeInterceptor<null | OutputId>();

    // console.log("deleteDto")
    // console.log(command.deleteDto)

    const { userId, postId } = command.deleteDto;

    const  post = await this.postRepo.getPostById(postId);

    if (!post){
      notice.addError(
        'not found post with id: ' + postId,
        this.location,
        GetErrors.NotFound,
      );
      return notice;
    }

    const  postUserId = post.id;

    if (postUserId !== userId){
      notice.addError(
        'denied of access to post',
      );
      return notice;
    }

    return notice;
  }
}
