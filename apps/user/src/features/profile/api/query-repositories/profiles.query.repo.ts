import { Injectable } from '@nestjs/common';
import { Prisma, ProfileImage } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { DatabaseService } from '@user/core/db/prisma/prisma.service';
import {
  getUserProfileViewModel,
  UserProfileViewModel,
} from '../models/output/profile.view.model';

@Injectable()
export class ProfilesQueryRepo {
  private readonly profiles: Prisma.UserProfileDelegate<DefaultArgs>;
  private readonly profileImages: Prisma.ProfileImageDelegate<DefaultArgs>;
  constructor(private prisma: DatabaseService) {
    this.profiles = this.prisma.userProfile;
    this.profileImages = this.prisma.profileImage;
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

  async getProfileImage(id: string) {
    try {
      const result = await this.profileImages.findUnique({
        where: { profileId: id },
      });
      if (!result) return null;
      return this.mapProfileImageToView(result);
    } catch (error) {
      console.error('Database fails operate with find user profile', error);
      return null;
    }
  }

  private mapProfileToView() {}
  private mapProfileImageToView(image: ProfileImage) {
    return {
      id: image.id,
      createdAt: image.createdAt,
      urlLarge: image.urlLarge,
      urlSmall: image.urlSmall,
      urlOriginal: image.urlOriginal,
    };
  }
}
