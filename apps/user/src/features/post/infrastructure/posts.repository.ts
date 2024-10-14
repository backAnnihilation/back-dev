import { Injectable } from '@nestjs/common';
import { Post, PostImage, Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { BaseRepository, DatabaseService } from '@user/core';

@Injectable()
export class PostsRepository extends BaseRepository<
  Prisma.PostDelegate<DefaultArgs>,
  Prisma.PostUncheckedCreateInput,
  Post
> {
  private readonly postImages: Prisma.PostImageDelegate<DefaultArgs>;
  constructor(private readonly prisma: DatabaseService) {
    super(prisma.post);
    this.postImages = this.prisma.postImage;
  }

  async saveImage(
    data: Prisma.PostImageUncheckedCreateInput,
  ): Promise<PostImage> {
    try {
      return this.postImages.create({ data });
    } catch (error) {
      console.log(`failed save image ${error}`);
      throw new Error(error.message);
    }
  }

  async updateImage(id: string, data: Prisma.PostImageUncheckedUpdateInput) {
    try {
      return this.postImages.update({ where: { id }, data });
    } catch (error) {
      console.log(`failed update image ${error}`);
      throw new Error(error.message);
    }
  }
}
