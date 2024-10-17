import { Injectable } from '@nestjs/common';
import { ImageStatus, Prisma, ProfileImage, UserProfile } from '@prisma/client';
import { BaseRepository, DatabaseService } from '@user/core';
import { UpdateProfileImageType } from '../api/models/input/update-profile-image-type.model';
import { FollowCountUpdate } from '../api/models/input/follow-counts.model';

@Injectable()
export class ProfilesRepository extends BaseRepository<
  Prisma.UserProfileDelegate,
  Prisma.UserProfileCreateInput,
  UserProfile
> {
  private userProfiles: Prisma.UserProfileDelegate;
  private profileImages: Prisma.ProfileImageDelegate;
  constructor(private readonly prisma: DatabaseService) {
    super(prisma.userProfile);
    this.userProfiles = this.prismaModel;
    this.profileImages = this.prisma.profileImage;
  }
  async save(
    data: Prisma.UserProfileUncheckedCreateInput,
  ): Promise<UserProfile> {
    try {
      return await this.userProfiles.create({ data });
    } catch (error) {
      console.log(`failed save profile ${error}`);
      throw new Error(error);
    }
  }

  async saveImage(
    data: Prisma.ProfileImageUncheckedCreateInput,
  ): Promise<ProfileImage> {
    try {
      return await this.profileImages.create({ data });
    } catch (error) {
      console.log(`failed save image ${error}`);
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

  async getProfileImage(id: string): Promise<ProfileImage | null> {
    try {
      const result = await this.profileImages.findUnique({ where: { id } });

      if (!result) return null;

      return result;
    } catch (error) {
      console.error(`getProfile image${error}`);
      return null;
    }
  }

  async updateProfileImageStatus(id: string, status: ImageStatus) {
    try {
      return await this.profileImages.update({
        where: { id },
        data: { status },
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
    id: string,
    imageDto: UpdateProfileImageType,
  ): Promise<ProfileImage> {
    try {
      return await this.profileImages.update({
        where: { id },
        data: { ...imageDto },
      });
    } catch (error) {
      console.error(`updateProfileImage ${error}`);
      throw new Error(error);
    }
  }

  async updateFollowerAndFollowingCounts(
    dto: FollowCountUpdate,
  ): Promise<void> {
    const { followerId, followingId, operation } = dto;
    try {
      await this.userProfiles.update({
        where: { userId: followerId },
        data: { followingCount: { increment: operation } },
      });

      await this.userProfiles.update({
        where: { userId: followingId },
        data: { followerCount: { increment: operation } },
      });
    } catch (error) {
      console.error(`updateFollowerAndFollowingCounts ${error}`);
      throw new Error(error);
    }
  }
}
