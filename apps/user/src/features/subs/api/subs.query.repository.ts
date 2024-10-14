import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { DatabaseService } from '@user/core';
import {
  FollowersView,
  FollowingView,
  ViewSubsCount,
} from './models/output-models/view-sub.model';

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

  async getFollowing(userId: string): Promise<FollowingView[] | null> {
    try {
      const following = await this.subs.findMany({
        where: {
          followerId: userId,
        },
      });
      if (!following.length) return null;
      return following.map((sub) => ({
        id: sub.id,
        followingId: sub.followingId,
        createdAt: sub.createdAt,
      }));
    } catch (e) {
      return null;
    }
  }

  async getFollowers(userId: string): Promise<FollowersView[] | null> {
    try {
      const followers = await this.subs.findMany({
        where: {
          followingId: userId,
        },
      });
      
      return followers.map((sub) => ({
        id: sub.id,
        followerId: sub.followerId,
        createdAt: sub.createdAt,
      }));
    } catch (e) {
      return null;
    }
  }

  async getUserFollowCounts(userId: string): Promise<ViewSubsCount> {
    try {
      const [followingCount, followerCount] = await Promise.all([
        this.subs.count({ where: { followingId: userId } }),
        this.subs.count({ where: { followerId: userId } }),
      ]);

      return { followingCount, followerCount };
    } catch (error) {
      console.log('Error fetching follower/following counts:', error);
      return null;
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
