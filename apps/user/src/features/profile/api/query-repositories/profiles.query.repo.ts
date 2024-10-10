import { Injectable } from '@nestjs/common';
import { ImageStatus, Prisma, ProfileImage } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { DatabaseService } from '@user/core';
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
        where: { id },
      });
      if (!result) return null;
      return this.mapProfileImageToView(result);
    } catch (error) {
      console.error(
        'Database fails operate with find user profile image',
        error,
      );
      return null;
    }
  }

  async getProfileImages(profileId: string) {
    try {
      const profileImages = await this.profileImages.findMany({
        where: { profileId, status: ImageStatus.completed },
        orderBy: { createdAt: 'desc' },
      });
      return profileImages.map(this.mapProfileImageToView);
    } catch (error) {}
  }

  private mapProfileToView() {}
  private mapProfileImageToView(image: ProfileImage) {
    return {
      id: image.id,
      profileId: image.profileId,
      createdAt: image.createdAt,
      urlLarge: image.urlLarge,
      urlSmall: image.urlSmall,
      urlOriginal: image.urlOriginal,
    };
  }
}
