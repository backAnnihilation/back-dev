import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { PaginationViewModel } from '@app/shared';
import { PrismaService } from '@user/core';
import { PostsQueryFilter } from '../models/input/post-query-filter';
import { getPostViewModel } from '../models/output/post.view.model';
import { PostViewModel } from '../models/output/post-view-type.model';

@Injectable()
export class PostQueryRepository {
  private readonly posts: Prisma.PostDelegate<DefaultArgs>;
  constructor(private prisma: PrismaService) {
    this.posts = this.prisma.post;
  }

  async getAllPosts(userId: string, queryOptions: PostsQueryFilter) {
    const { pageNumber, pageSize, skip, sortBy, sortDirection } =
      PaginationViewModel.parseQuery(queryOptions);

    const [description] = [`%${queryOptions.searchDescriptionTerm || ''}%`];

    try {
      const posts = await this.posts.findMany({
        where: {
          description: { contains: description, mode: 'insensitive' },
        },
        skip,
        take: pageSize,
        orderBy: { [sortBy]: sortDirection },
      });
      const postsCount = await this.posts.count();

      return new PaginationViewModel<PostViewModel>(
        posts.map(getPostViewModel),
        pageNumber,
        pageSize,
        postsCount,
      );
    } catch (error) {
      console.log('get all posts', error);
    }
  }

  async getPostsCurrentUser(
    userId: string,
    queryOptions: PostsQueryFilter,
  ): Promise<PaginationViewModel<PostViewModel>> {
    const { pageNumber, pageSize, skip, sortBy, sortDirection } =
      PaginationViewModel.parseQuery(queryOptions);
    try {
      const posts = await this.posts.findMany({
        where: { userId },
        skip,
        take: pageSize,
        orderBy: { [sortBy]: sortDirection },
      });
      const postsCount = await this.posts.count({ where: { userId } });

      return new PaginationViewModel<PostViewModel>(
        posts.map(getPostViewModel),
        pageNumber,
        pageSize,
        postsCount,
      );
    } catch (error) {
      console.error('Database fails operate with find user posts', error);
    }
  }
  async getById(id: string): Promise<PostViewModel> {
    try {
      const post = await this.posts.findUnique({
        where: { id },
        include: { image: true },
      });

      if (!post) return null;

      return getPostViewModel(post);
    } catch (error) {
      console.error('Database fails operate with find user post', error);
      return null;
    }
  }
}
