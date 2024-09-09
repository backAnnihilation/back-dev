import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { DatabaseService } from '../../../../../core/db/prisma/prisma.service';
import {
  getUserProfileViewModel,
  UserProfileViewModel,
} from '../models/output/profile.view.model';

@Injectable()
export class ProfilesQueryRepo {
  private readonly profiles: Prisma.UserProfileDelegate<DefaultArgs>;
  constructor(private prisma: DatabaseService) {
    this.profiles = this.prisma.userProfile;
  }

  async getById(id: string): Promise<UserProfileViewModel | null> {
    try {
      const result = await this.profiles.findUnique({ where: { id } });
      
      if (!result) return null;
      
      return getUserProfileViewModel(result);
    } catch (error) {
      console.error('Database fails operate with find user profile', error);
      return null;
    }
  }
}
