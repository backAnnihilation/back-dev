import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { UserPostViewModel } from '../models/output/post.view.model';
import { DatabaseService } from '@user/core/db/prisma/prisma.service';


@Injectable()
export class PostQueryRepo {
  private readonly profiles: Prisma.UserProfileDelegate<DefaultArgs>;
  constructor(private prisma: DatabaseService) { 
    this.profiles = this.prisma.userProfile;
  }

  async getLastPosts(): Promise<UserPostViewModel | null> {
    try {
      const result = await this.profiles.findMany();
      if (!result) return null;
      return result      
      
      // return getUserPostViewModel(result);
    } catch (error) {
      console.error('Database fails operate with find user post', error);
      return null;
    }
  }

  async getById(id: string): Promise<UserPostViewModel | null> {
    try {
      const result = await this.profiles.findUnique({ where: { id } });
      if (!result) return null;
      return result      
      
      // return getUserPostViewModel(result);
    } catch (error) {
      console.error('Database fails operate with find user post', error);
      return null;
    }
  }
}