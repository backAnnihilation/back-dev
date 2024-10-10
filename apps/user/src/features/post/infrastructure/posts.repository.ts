import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { DatabaseService } from '@user/core/db/prisma/prisma.service';
import { BaseRepository } from '@user/core/db/base.repository';
import { EditUserPostDTO } from '../application/dto/edit-post.dto';
import { CreatePostDTO } from '../application/dto/create-post.dto';

@Injectable()
export class PostsRepository extends BaseRepository {
  private readonly posts: Prisma.PostDelegate<DefaultArgs>;
  constructor(protected prisma: DatabaseService) {
    super(prisma);
    this.posts = this.prisma.post;
  }
  async create(postDto: CreatePostDTO) {
    try {
      return await this.posts.create({ data: postDto });
    } catch (error) {
      console.log(error);
      throw new Error(`post is not saved: ${error}`);
    }
  }

  async update(postDto: EditUserPostDTO) {
    try {
      return await this.posts.update({
        data: { description: postDto.description },
        where: { id: postDto.postId, userId: postDto.userId },
      });
    } catch (error) {
      console.log(`userPost is not updated: ${error}`);
      return null;
    }
  }

  async getPostById(id: string) {
    try {
      return await this.posts.findUnique({ where: { id } });
    } catch (error) {
      console.log(`error in getPostById: ${error}`);
      return null;
    }
  }

  async deletePost(id: string) {
    try {
      return await this.posts.delete({ where: { id: id } });
    } catch (error) {
      throw new Error(`error in deletePostUser: ${error}`);
    }
  }
}
