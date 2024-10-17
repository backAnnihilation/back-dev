import { Injectable } from '@nestjs/common';
import { Prisma, Subs, SubStatus } from '@prisma/client';
import { BaseRepository, DatabaseService } from '@user/core';
import { InputSubscriptionDto } from '../api/models/input-models/sub.model';

@Injectable()
export class SubsRepository extends BaseRepository<
  Prisma.SubsDelegate,
  Prisma.SubsCreateInput,
  Subs
> {
  constructor(prisma: DatabaseService) {
    super(prisma.subs);
  }

  async findFollowerSubscription(subDto: InputSubscriptionDto) {
    const { followerId, followingId } = subDto;
    try {
      return await this.prismaModel.findUnique({
        where: { followerId_followingId: { followerId, followingId } },
      });
    } catch (e) {
      return null;
    }
  }

  async updateStatus(id: string, status: SubStatus) {
    try {
      return await this.prismaModel.update({
        where: { id },
        data: { status },
      });
    } catch (error) {
      throw new Error(`Error updating subscription status: ${error}`);
    }
  }

  async isSubscribed(
    followerId: string,
    followingId: string,
  ): Promise<Subs | null> {
    try {
      return await this.prismaModel.findUnique({
        where: {
          followerId_followingId: { followerId, followingId },
          status: SubStatus.active,
        },
      });
    } catch (e) {
      return null;
    }
  }

  async create(data: InputSubscriptionDto) {
    try {
      return await this.prismaModel.create({ data });
    } catch (e) {
      console.error(e);
      throw new Error(`Error creating subscription: ${e}`);
    }
  }
}
