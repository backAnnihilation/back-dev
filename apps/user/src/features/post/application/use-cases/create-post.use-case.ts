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
import { ICreatePostCommand } from '../../api/models/input/create-post.model';
import { CreateUserPostDTO } from '../dto/create-post.dto';
// import { NewUserPostDTO } from '../dto/create2-profile.dto';
('../../api/models/input-models/fill-profile.model');

export class CreatePostCommand {
  constructor(public postDto: ICreatePostCommand) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase
  implements ICommandHandler<CreatePostCommand>
{
  private location = this.constructor.name;  
  constructor(
    private userRepo: UsersRepository,
    private postRepo: PostsRepository,
    // private profilesRepo: ProfilesRepository,
  ) {}

  async execute(
    command: CreatePostCommand,
  ): Promise<LayerNoticeInterceptor<OutputId>> {
  // ): Promise<any> {
    let notice = new LayerNoticeInterceptor<null | OutputId>();

    const { userId, description } = command.postDto;


    const postDto = new CreateUserPostDTO({
      ...command.postDto,
    });


    const result = await this.postRepo.saveEntity(
      "userProfile",
      // "userPost" ????
      postDto,
    );

    notice.addData({ id: result.id });
    return notice;

  }
}
