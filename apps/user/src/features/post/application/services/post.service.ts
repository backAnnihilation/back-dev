import { Injectable } from '@nestjs/common';
import { AxiosAdapter } from '@user/core/adapters/axios.adapter';
import { FileMetadata } from '@app/shared';
import { Post } from '@prisma/client';

@Injectable()
export class UserPostService {
  constructor() {}

  async checkUserRights(post: Post, userId: string): Promise<void> {}
}

export type UploadFileDto = {
  image: FileMetadata;
  userId: string;
};
