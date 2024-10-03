import { Injectable } from '@nestjs/common';
import { ImageStatus, Prisma, ProfileImage, UserProfile } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { DatabaseService, BaseRepository } from '@user/core';
import { UpdateProfileImageType } from '../api/models/input/update-profile-image-type.model';

@Injectable()
export class ProfilesRepository extends BaseRepository {
  private userProfiles: Prisma.UserProfileDelegate<DefaultArgs>;
  private profileImages: Prisma.ProfileImageDelegate<DefaultArgs>;
  constructor(readonly prisma: DatabaseService) {
    super(prisma);
    this.userProfiles = this.prisma.userProfile;
    this.profileImages = this.prisma.profileImage;
  }
  async save(data: Prisma.UserProfileCreateInput): Promise<UserProfile> {
    try {
      return await this.userProfiles.create({ data });
    } catch (error) {
      console.log(`failed save profile ${error}`);
      throw new Error(error);
    }
  }

  async getByUserId(userId: string): Promise<UserProfile | null> {
    try {
      const result = await this.userProfiles.findUnique({
        where: { userId },
      });

      if (!result) return null;

      return result;
    } catch (error) {
      console.error(`getByUserId ${error}`);
      return null;
    }
  }

  async update(
    profileId: string,
    updatedFields: Prisma.UserProfileUpdateInput,
  ): Promise<UserProfile> {
    try {
      return await this.userProfiles.update({
        where: { id: profileId },
        data: updatedFields,
      });
    } catch (error) {
      console.error(`update ${error}`);
      throw new Error(error);
    }
  }

  async getById(id: string): Promise<UserProfile | null> {
    try {
      const result = await this.userProfiles.findUnique({ where: { id } });

      if (!result) return null;

      return result;
    } catch (error) {
      console.error(`getById ${error}`);
      return null;
    }
  }

  async getProfileImage(profileId: string): Promise<ProfileImage | null> {
    try {
      const result = await this.profileImages.findUnique({
        where: { profileId },
      });

      if (!result) return null;

      return result;
    } catch (error) {
      console.error(`getProfile ${error}`);
      return null;
    }
  }

  async updateProfileImageStatus(profileImageId: string) {
    try {
      return await this.profileImages.update({
        where: { id: profileImageId },
        data: { status: ImageStatus.success },
      });
    } catch (error) {
      console.error(`updateProfileImageStatus ${error}`);
      throw new Error(error);
    }
  }

  async deleteProfileImage(profileImageId: string) {
    try {
      return await this.profileImages.delete({
        where: { id: profileImageId },
      });
    } catch (error) {
      console.error(`deleteProfileImage ${error}`);
      throw new Error(error);
    }
  }

  async updateProfileImage(
    profileId: string,
    updateImageDto: UpdateProfileImageType,
  ): Promise<ProfileImage> {
    try {
      const { urls, status } = updateImageDto;
      return await this.profileImages.update({
        where: { profileId },
        data: {
          ...urls,
          status,
        },
      });
    } catch (error) {
      console.error(`updateProfileImage ${error}`);
      throw new Error(error);
    }
  }
}
