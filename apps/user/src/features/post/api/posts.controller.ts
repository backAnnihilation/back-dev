import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import {
  ApiTagsEnum,
  RoutingEnum,
} from '../../../../../../libs/shared/routing';
import { UserNavigate } from '../../../../core/routes/user-navigate';
import { UserPayload } from '../../auth/infrastructure/decorators/user-payload.decorator';
import { AccessTokenGuard } from '../../auth/infrastructure/guards/accessToken.guard';
import { UserSessionDto } from '../../security/api/models/security-input.models/security-session-info.model';
import { EditPostCommand } from '../application/use-cases/edit-post.use-case';
import { PostQueryRepo } from './query-repositories/post.query.repo';
import { EditPostInputModel } from './models/input/edit-profile.model';
import { UserPostApiService } from '../application/services/user-api.service';
import { DeletePostCommand } from '../application/use-cases/delete-post.use-case';
import { CreatePostInputModel } from './models/input/create-post.model';
import { CreatePostCommand } from '../application/use-cases/create-post.use-case';
import { UserPostViewModel } from './models/output/post.view.model';



// декораторы для свагера 
@ApiTags(ApiTagsEnum.Posts)
@Controller(RoutingEnum.posts)
export class UserPostsController {
  constructor(
    private commandBus: CommandBus,
    private UserPostApiService: UserPostApiService,
    private postQueryRepo: PostQueryRepo,
    // private profileService: UserProfileService,
  ) {}



  // по айди пользователя получить все его посты (доступно всем незареганым пользователям)
  // 8шт, авторизированный может получать частями по 8постов через скролл
  @Get()
  async getUserPosts(
    // @Param(':id') postId: string,
    @Query() postId: any,
  ): Promise<UserPostViewModel> {  

    const id = postId.id
    const post = await this.postQueryRepo.getById(id);
    if (!post) {
      throw new NotFoundException('post not found');
    }
    return post;
  }


  // @UseGuards(AccessTokenGuard)
  @Post("create")
  async createPost(
    // @UserPayload() userPayload: UserSessionDto,
    @Body() createPostDto: CreatePostInputModel,
  ) {

    // const userId = ....
    
    const command = new CreatePostCommand({
      ...createPostDto,
      // userId: userPayload.userId,
      userId: "1234567",
    });
    return this.UserPostApiService.create(command);
  }


  // @UseGuards(AccessTokenGuard)
  // @Post(PostNavigate.EditPost)
  @Post("edit")
  async editPost(
    // @UserPayload() userPayload: UserSessionDto,
    @Body() editPostDto: EditPostInputModel,
  ) {
    
    const command = new EditPostCommand({
      ...editPostDto,
      // userId: userPayload.userId,
      userId: "1234567",
    });
    return this.UserPostApiService.create(command);
  }

  @Delete(":id")
  async deletePost(
    @Param() query: {id: string},
    // @UserPayload() userPayload: UserSessionDto,
  ) {

    const command = new DeletePostCommand({
      userId: query.id,
      postId: "1234567",
    });
    return this.UserPostApiService.create(command);
  }



 

}
