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
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import {
  ApiTagsEnum,
  RoutingEnum,
  PaginationViewModel,
  FileMetadata,
} from '@app/shared';
import { CurrentUserId } from '@user/core/decorators/current-user-id.decorator';
import { UserPayload } from '../../../auth/infrastructure/decorators/user-payload.decorator';
import { AccessTokenGuard } from '../../../auth/infrastructure/guards/accessToken.guard';
import { UserIdExtractor } from '../../../auth/infrastructure/guards/set-user-id.guard';
import { UserSessionDto } from '../../../security/api/models/security-input.models/security-session-info.model';
import { PostCudApiService } from '../../application/services/post-cud-api.service';
import { CreatePostCommand } from '../../application/use-cases/create-post.use-case';
import { DeletePostCommand } from '../../application/use-cases/delete-post.use-case';
import { EditPostCommand } from '../../application/use-cases/edit-post.use-case';
import { ImagePhotoPipe } from '../../infrastructure/validation/create-post-photo';
import { CreatePostInputModel } from '../models/input/create-post.model';
import { EditPostInputModel } from '../models/input/edit-profile.model';
import { PostsQueryFilter } from '../models/input/post-query-filter';
import { PostViewModel } from '../models/output/post.view.model';
import { PostQueryRepository } from '../query-repositories/post.query.repository';
import { CreatePostEndpoint } from '../swagger/create-post.description';
import { DeletePostEndpoint } from '../swagger/delete-post.description';
import { GetPostEndpoint } from '../swagger/get-user-post.description';
import { GetUserPostsEndpoint } from '../swagger/get-user-posts.description';
import { UpdatePostEndpoint } from '../swagger/update-post.description';

@ApiTags(ApiTagsEnum.Posts)
@Controller(RoutingEnum.posts)
export class PostsController {
  constructor(
    private postApiService: PostCudApiService,
    private postQueryRepo: PostQueryRepository,
  ) {}

  @Get()
  @UseGuards(UserIdExtractor)
  async getAllPosts(
    @CurrentUserId() userId: string,
    @Query() queryOptions: PostsQueryFilter,
  ): Promise<PaginationViewModel<PostViewModel>> {
    return this.postQueryRepo.getAllPosts(userId, queryOptions);
  }

  @GetUserPostsEndpoint()
  @Get(':id/posts')
  async getUserPosts(
    @Param('id') userId: string,
    @Query() queryOptions: PostsQueryFilter,
  ): Promise<PaginationViewModel<PostViewModel>> {
    return this.postQueryRepo.getPostsCurrentUser(userId, queryOptions);
  }

  @GetPostEndpoint()
  @UseGuards(AccessTokenGuard)
  @Get(':id')
  async getPost(@Param('id') postId: string): Promise<PostViewModel> {
    const post = await this.postQueryRepo.getById(postId);
    if (!post) throw new NotFoundException();
    return post;
  }

  @CreatePostEndpoint()
  @Post()
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor('image'))
  async createPost(
    @CurrentUserId() userId: string,
    @Body() createPostDto: CreatePostInputModel,
    @UploadedFile(new ImagePhotoPipe()) image: FileMetadata,
  ): Promise<PostViewModel> {
    const command = new CreatePostCommand({
      ...createPostDto,
      image,
      userId,
    });
    return this.postApiService.create(command);
  }

  @UpdatePostEndpoint()
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id')
  async updatePost(
    @UserPayload() userPayload: UserSessionDto,
    @Body() editPostDto: EditPostInputModel,
    @Param('id') postId: string,
  ) {
    const command = new EditPostCommand({
      ...editPostDto,
      userId: userPayload.userId,
      postId,
    });
    return this.postApiService.updateOrDelete(command);
  }

  @DeletePostEndpoint()
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deletePost(
    @Param('id') postId: string,
    @UserPayload() userPayload: UserSessionDto,
  ) {
    const command = new DeletePostCommand({
      userId: userPayload.userId,
      postId,
    });
    return this.postApiService.updateOrDelete(command);
  }
}
