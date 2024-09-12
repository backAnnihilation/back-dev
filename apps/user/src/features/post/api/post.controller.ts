import { FileType } from '@models/file.models';
import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiTagsEnum, RoutingEnum } from '@shared/routing';
import { UserNavigate } from '@user/core/routes/user-navigate';
import { UserPayload } from '../../auth/infrastructure/decorators/user-payload.decorator';
import { AccessTokenGuard } from '../../auth/infrastructure/guards/accessToken.guard';
import { UserSessionDto } from '../../security/api/models/security-input.models/security-session-info.model';
import { PostQueryRepo } from './query-repositories/post.query.repo';
import { UserPostViewModel } from './models/output/post.view.model';
import { CreatePostInputModel } from './models/input/create-post.model';
import { CreatePostCommand } from '../application/use-cases/create-post.use-case';
// import { UserPostApiService } from '../application/services/user-api.service';
import { UserPostApiService } from '../application/services/post-api.service';
import { EditPostInputModel } from './models/input/edit-profile.model';
import { EditPostCommand } from '../application/use-cases/edit-post.use-case';
import { DeletePostCommand } from '../application/use-cases/delete-post.use-case';

@ApiTags(ApiTagsEnum.Posts)
@Controller(RoutingEnum.posts) 
export class PostsController {
  constructor(
    private postQueryRepo: PostQueryRepo,
    private userPostApiService: UserPostApiService,

  ) {} // private profileService: UserProfileService, // private profilesQueryRepo: ProfilesQueryRepo, // private userProfilesApiService: UserProfilesApiService, // private commandBus: CommandBus,

  // @Get(UserNavigate.GetProfile)

  @Get()
  async getLastUserPosts(
  ): Promise<UserPostViewModel> {  
    const post = await this.postQueryRepo.getLastPosts();
    if (!post) {
      // throw new NotFoundException('post not found');
    }
    return post;
  }

  @Get(":id")
  async getUserPost(
    @Param() postId: {id: string},
  ): Promise<UserPostViewModel> {  
    const id = postId.id
    const post = await this.postQueryRepo.getById(id);
    if (!post) {
      // throw new NotFoundException('post not found');
    }
    return post;
  }

    // @UseGuards(AccessTokenGuard)
    @Post("create")
    async createPost(
      // @UserPayload() userPayload: UserSessionDto,
      @Body() createPostDto: CreatePostInputModel,
    ) {

      console.log("createPostDto")
      console.log(createPostDto)
  
      // const userId = ....
      
      const command = new CreatePostCommand({
        ...createPostDto,
        // userId: userPayload.userId,
        userId: "1234567",
      });
      return this.userPostApiService.create(command);
    }


    // @UseGuards(AccessTokenGuard)
  // @Post(PostNavigate.EditPost)
  @Post("edit/:id")
  async editPost(
    @Param() postId: {id: string},
    // @UserPayload() userPayload: UserSessionDto,
    @Body() editPostDto: EditPostInputModel,
  ) {
    const command = new EditPostCommand({
      ...editPostDto,
      // userId: userPayload.userId,
      userId: "1234567",
    });
    return this.userPostApiService.create(command);
  }

  @Delete(":id")
  async deletePost(
    @Param() postId: {id: string},
    // @UserPayload() userPayload: UserSessionDto,
  ) {

    console.log("qqqqq")
    console.log(postId)

    const command = new DeletePostCommand({
      userId: postId.id,
      postId: "1234567",
    });
    return this.userPostApiService.updateOrDelete(command);
  }




  // @HttpCode(HttpStatus.NO_CONTENT)
  @Post()
  @UseGuards(AccessTokenGuard)
  async uploadProfilePhoto(
    @UserPayload() userPayload: UserSessionDto,
    image: FileType,
  ): Promise<any> {
    // return this.profileService.uploadProfilePhoto({
    //   image,
    //   userId: userPayload.userId,
    // });
  }
}
