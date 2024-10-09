import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

import { DatabaseService } from '@user/core/db/prisma/prisma.service';
import { BaseRepository } from '@user/core/db/base.repository';

import { InputSubscriptionDto } from '../api/models/input-models/sub.model';

@Injectable()
export class SubsRepository extends BaseRepository {
  private readonly subs: Prisma.SubsDelegate<DefaultArgs>;
  constructor(protected prisma: DatabaseService) {
    super(prisma);
    this.subs = this.prisma.subs;
  }

  async getSubscription(subDto: InputSubscriptionDto) {
    try {
      return await this.subs.findFirst({
        where: {
          followerId: subDto.followerId,
          followingId: subDto.followingId,
        },
      });
    } catch (e) {
      return null;
    }
  }

  async create(subDto: InputSubscriptionDto) {
    try {
      return await this.subs.create({
        data: {
          followerId: subDto.followerId,
          followingId: subDto.followingId,
        },
      });
    } catch (e) {
      console.error('Error creating subscription', e);
      return null;
    }
  }

  async delete(subDto: InputSubscriptionDto): Promise<boolean> {
    try {
      const subscription = await this.subs.findFirst({
        where: {
          followerId: subDto.followerId,
          followingId: subDto.followingId,
        },
      });

      if (!subscription) {
        return false;
      }

      await this.subs.delete({
        where: {
          id: subscription.id,
        },
      });

      return true;
    } catch (e) {
      console.error('Error deleting subscription', e);
      return false;
    }
  }
}
