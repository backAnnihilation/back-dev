import { Injectable } from '@nestjs/common';
import { Post, PostImage, Prisma } from '@prisma/client';
import { BaseRepository, PrismaService } from '@user/core';

@Injectable()
export class PostsRepository extends BaseRepository<Post> {
  private readonly postImages: Prisma.PostImageDelegate;
  constructor(private readonly prisma: PrismaService) {
    super(prisma, 'post');
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
