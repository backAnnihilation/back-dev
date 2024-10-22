import { PaginationViewModel } from '@app/shared';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as request from 'supertest';
import { PrismaService } from '../../../src/core';
import { AuthUserWithToken } from '../../../src/features/auth/api/models/auth.output.models/auth.user.types';
import { CreatePostInputModel } from '../../../src/features/post/api/models/input/create-post.model';
import { EditPostInputModel } from '../../../src/features/post/api/models/input/edit-post.model';
import { PostsQueryFilter } from '../../../src/features/post/api/models/input/post-query-filter';
import { PostViewModel } from '../../../src/features/post/api/models/output/post-view-type.model';
import { SuperTestBody } from '../models/body.response.model';
import { ImageNames } from '../models/image-names.enum';
import { PostsRouting } from '../routes/posts.routing';
import { BaseTestManager } from './BaseTestManager';

export class PostsTestManager extends BaseTestManager {
  private readonly routing: PostsRouting;
  private readonly postsRepo: Prisma.PostDelegate;
  constructor(
    protected readonly app: INestApplication,
    private prisma: PrismaService,
  ) {
    super(app);
    this.postsRepo = this.prisma.post;
    this.routing = new PostsRouting();
  }

  createInputData(field?: CreatePostInputModel | object): CreatePostInputModel {
    let description = ' ';
    if (field) {
      description =
        (field as CreatePostInputModel).description ||
        this.constants.description;
    }
    return { description };
  }

  async createPosts(users: AuthUserWithToken[], count: number) {
    for (let i = 0; i < count; i++) {
      const postInputData = this.createInputData({
        description: `post${i} description`,
      });
      const postDto = {
        ...postInputData,
        imageName: i % 2 ? ImageNames.INSTA : ImageNames.JPEG,
      };
      await this.createPost(postDto, users[i].accessToken);
    }
  }

  async createPost(
    inputData: CreatePostInputModel & { imageName: ImageNames },
    accessToken: string,
    expectedStatus = HttpStatus.CREATED,
  ): Promise<PostViewModel> {
    let { buffer, contentType, filename } = await this.retrieveImageMeta(
      inputData.imageName,
    );
    let post: PostViewModel;
    await request(this.application)
      .post(this.routing.createPost())
      .auth(accessToken, this.authConstants.authBearer)
      .send(inputData)
      .attach('image', buffer, { filename, contentType })
      .expect(({ body, status }: SuperTestBody<PostViewModel>) => {
        expect(status).toBe(expectedStatus);
        post = body;
      });

    return post;
  }

  async updatePost(
    inputData: EditPostInputModel & { postId: string },
    accessToken?: string,
    expectStatus = HttpStatus.NO_CONTENT,
  ) {
    await request(this.application)
      .put(this.routing.updatePost(inputData.postId))
      .auth(accessToken || '', this.authConstants.authBearer)
      .send(inputData)
      .expect(expectStatus);
  }

  async getUserPosts(
    accessToken: string,
    userId: string,
    query?: Partial<PostsQueryFilter>,
    expectStatus = HttpStatus.OK,
  ) {
    let commentsPaging: PaginationViewModel<PostViewModel>;
    await request(this.application)
      .get(this.routing.getUserPosts(userId))
      .auth(accessToken, this.authConstants.authBearer)
      .query(query)
      .expect(expectStatus)
      .expect(({ body }: SuperTestBody<PaginationViewModel<PostViewModel>>) => {
        commentsPaging = body;
      });

    return commentsPaging;
  }

  async getPosts(
    accessToken: string,
    query?: Partial<PostsQueryFilter>,
    expectStatus = HttpStatus.OK,
  ) {
    let commentsPaging: PaginationViewModel<PostViewModel>;
    await request(this.application)
      .get(this.routing.getPosts())
      .auth(accessToken, this.authConstants.authBearer)
      .query(query)
      .expect(expectStatus)
      .expect(({ body }: SuperTestBody<PaginationViewModel<PostViewModel>>) => {
        commentsPaging = body;
      });

    return commentsPaging;
  }

  async getPost(
    postId: string,
    accessToken?: string,
    expectStatus = HttpStatus.OK,
  ): Promise<PostViewModel> {
    let postViewModel: PostViewModel;
    await request(this.application)
      .get(this.routing.getPost(postId))
      .auth(accessToken || '', this.authConstants.authBearer)
      .expect(expectStatus)
      .expect(({ body }: SuperTestBody<PostViewModel>) => {
        postViewModel = body;
      });

    return postViewModel;
  }

  async deletePost(
    postId: string,
    accessToken = '',
    expectedStatus = HttpStatus.NO_CONTENT,
  ) {
    const beforeDelete = await request(this.application)
      .get(this.routing.getPost(postId))
      .expect(({ body }: SuperTestBody<PostViewModel>) => {
        expect(body.id).toBe(postId);
      });

    await request(this.application)
      .delete(this.routing.deletePost(postId))
      .auth(accessToken, this.authConstants.authBearer)
      .expect(expectedStatus);

    const afterDelete = await request(this.application)
      .get(this.routing.getPost(postId))
      .expect(HttpStatus.NOT_FOUND);
  }
}
