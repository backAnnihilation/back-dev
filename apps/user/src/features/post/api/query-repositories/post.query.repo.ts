import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { DatabaseService } from '../../../../../core/db/prisma/prisma.service';

import { UserPostViewModel } from '../models/output/post.view.model';


@Injectable()
export class PostQueryRepo {
  private readonly profiles: Prisma.UserProfileDelegate<DefaultArgs>;
  constructor(private prisma: DatabaseService) {
    this.profiles = this.prisma.userProfile;
  }

  async getById(id: string): Promise<UserPostViewModel | null> {
    try {
      const result = await this.profiles.findUnique({ where: { id } });
      // return result
      console.log("result")
      console.log(result)
      
      if (!result) return null;
      
      // return getUserPostViewModel(result);
    } catch (error) {
      console.error('Database fails operate with find user profile', error);
      return null;
    }
  }
}
