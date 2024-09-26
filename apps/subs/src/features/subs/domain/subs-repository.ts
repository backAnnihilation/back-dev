import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { InputSubscriptionDto } from '../api/models/input-models/sub.model';

import { UserSubscription } from './entities/subs.table';

@Injectable()
export class SubsRepository {
  constructor(
    @InjectModel(UserSubscription)
    private subscriptionModel: typeof UserSubscription,
  ) {}

  async getSubscription(
    subDto: InputSubscriptionDto,
  ): Promise<UserSubscription | null> {
    try {
      return await this.subscriptionModel.findOne({
        where: {
          followerId: subDto.followerId,
          followingId: subDto.followingId,
        },
      });
    } catch (e) {
      return null;
    }
  }

  async create(subDto: InputSubscriptionDto): Promise<UserSubscription> {
    try {
      return await this.subscriptionModel.create(subDto);
    } catch (e) {
      console.error('Error creating subscription', e);
      return null;
    }
  }

  async delete(subDto: InputSubscriptionDto): Promise<boolean> {
    try {
      const deletedCount = await this.subscriptionModel.destroy({
        where: {
          followerId: subDto.followerId,
          followingId: subDto.followingId,
        },
      });

      return !!deletedCount;
    } catch (e) {
      console.error('Error deleting subscription', e);
      return false;
    }
  }
}
