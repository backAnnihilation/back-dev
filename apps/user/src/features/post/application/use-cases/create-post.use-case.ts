import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { OutputId } from '../../../../../../../libs/shared/models/output-id.dto';
import {
  LayerNoticeInterceptor,
} from '../../../../../../../libs/shared/notification';
// import { UsersRepository } from '../../../admin/infrastructure/users.repo';
// import { PostsRepository } from '../../../admin/infrastructure/posts.repo';
import { ICreatePostCommand } from '../../api/models/input/create-post.model';
import { CreateUserPostDTO } from '../dto/create-post.dto';
import { PostsRepository } from '../../infrastructure/posts.repo';
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
    private postRepo: PostsRepository,
    // private profilesRepo: ProfilesRepository,
  ) {}

  async execute(
    command: CreatePostCommand,
  ): Promise<LayerNoticeInterceptor<OutputId>> {
    let notice = new LayerNoticeInterceptor<null | OutputId>();

  
    const { userId, description } = command.postDto;


    const newPost = new CreateUserPostDTO({
      ...command.postDto,
    });

    console.log("newPost")
    console.log(newPost)


    const result = await this.postRepo.saveEntity(
      "userProfile",
      // "userPost" ????
      newPost,
    );

    console.log("------------------result----------------")
    console.log(result)

    notice.addData({ id: result.id });
    return notice;

  }
}
