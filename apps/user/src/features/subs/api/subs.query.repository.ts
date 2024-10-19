import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@user/core';
import {
  mapSubToView,
  SubPayload,
} from './models/output-models/sub.view.model';
import {
  FollowersView,
  FollowingView,
  SubViewModel,
  ViewSubsCount,
} from './models/output-models/view-sub-types.model';

@Injectable()
export class SubsQueryRepository {
  private readonly subs: Prisma.SubsDelegate;
  constructor(protected prisma: PrismaService) {
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

  async getById(id: string): Promise<SubViewModel | null> {
    try {
      const result = await this.subs.findUnique({
        where: { id },
        select: {
          id: true,
          status: true,
          followerId: true,
          followingId: true,
          follower: {
            select: {
              userProfile: {
                select: {
                  id: true,
                  userName: true,
                  followerCount: true,
                  followingCount: true,
                  images: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                    select: { urlOriginal: true },
                  },
                },
              },
            },
          },
          following: {
            select: {
              userProfile: {
                select: {
                  id: true,
                  userName: true,
                  followerCount: true,
                  followingCount: true,
                  images: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                    select: { urlOriginal: true },
                  },
                },
              },
            },
          },
          createdAt: true,
        },
      });
      if (!result) return null;

      return mapSubToView(result);
    } catch (error) {
      console.log(
        'subQueryRepo.getById:',
        error.message || JSON.stringify(error),
      );
      return null;
    }
  }

  async getByFollowerId(userId: string) {
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
