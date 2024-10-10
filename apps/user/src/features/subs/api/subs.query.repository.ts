import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { DatabaseService } from '@user/core';

@Injectable()
export class SubsQueryRepository {
  private readonly subs: Prisma.SubsDelegate<DefaultArgs>;
  constructor(protected prisma: DatabaseService) {
    this.subs = this.prisma.subs;
  }

  async getSubInfo() {
    try {
    } catch (error) {
      console.error('getSubInfo', { error });
      return null;
    }
  }

  async getFollowing(userId: string) {
    try {
      const following = await this.subs.findMany({
        where: {
          followerId: userId,
        },
        select: {
          followingId: true,
        },
      });

      return following.map((sub) => sub.followingId);
    } catch (e) {
      return null;
    }
  }

  async getFollowers(userId: string) {
    try {
      const followers = await this.subs.findMany({
        where: {
          followingId: userId,
        },
        select: {
          followerId: true,
        },
      });

      return followers.map((sub) => sub.followerId);
    } catch (e) {
      return null;
    }
  }

  async getFollowingCount(userId: string) {
    try {
      return await this.subs.count({
        where: {
          followerId: userId,
        },
      });
    } catch (e) {
      console.error('Error fetching following count:', e);
      return 0;
    }
  }

  async getFollowersCount(userId: string) {
    try {
      return await this.subs.count({
        where: {
          followingId: userId,
        },
      });
    } catch (e) {
      console.error('Error fetching followers count:', e);
      return 0;
    }
  }

  async getById(userId: string) {
    try {
      const following = await this.subs.findFirst({
        where: {
          followerId: userId,
        },
      });
      return following;
    } catch (e) {
      return null;
    }
  }
}
