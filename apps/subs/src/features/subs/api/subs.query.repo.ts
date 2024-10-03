import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { UserSubscription } from '../domain/entities/subs.table';

import {
  ViewFollowerModel,
  ViewSubsCount,
  ViewSubsModels,
} from './models/output-models/view-sub.model';

@Injectable()
export class SubsQueryRepo {
  constructor(
    @InjectModel(UserSubscription)
    private subscriptionModel: typeof UserSubscription,
  ) {}
  async getFollowing(userId: string) {
    try {
      const following = await this.subscriptionModel.findAll({
        where: {
          followerId: userId,
        },
        attributes: ['followingId'],
      });

      return following.map((sub) => sub.followingId);
    } catch (e) {
      return null;
    }
  }

  async getFollowers(userId: string) {
    try {
      const followers = await this.subscriptionModel.findAll({
        where: {
          followingId: userId,
        },
        attributes: ['followerId'],
      });

      return followers.map((sub) => sub.followerId);
    } catch (e) {
      return null;
    }
  }

  async getFollowingCount(userId: string) {
    try {
      return await this.subscriptionModel.count({
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
      return await this.subscriptionModel.count({
        where: {
          followingId: userId,
        },
      });
    } catch (e) {
      console.error('Error fetching followers count:', e);
      return 0;
    }
  }

  async getById(userId: string): Promise<UserSubscription> {
    try {
      const following = await this.subscriptionModel.findOne({
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
