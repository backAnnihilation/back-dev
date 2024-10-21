import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { Prisma, Subs, SubStatus } from '@prisma/client';
import { BaseRepository, PrismaService } from '@user/core';
import { InputSubscriptionDto } from '../api/models/input-models/sub.model';

@Injectable()
export class SubsRepository extends BaseRepository<Subs> {
  constructor(
    prisma: PrismaService,
    txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {
    super(prisma, 'subs', txHost);
  }

  async findFollowerSubscription(subDto: InputSubscriptionDto) {
    const { followerId, followingId } = subDto;
    try {
      return await this.model.findUnique({
        where: { followerId_followingId: { followerId, followingId } },
      });
    } catch (e) {
      return null;
    }
  }

  async updateStatus(id: string, status: SubStatus) {
    try {
      return await this.model.update({
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
      return await this.model.findUnique({
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
      return await this.getRepository.create({ data });
    } catch (e) {
      console.error(e);
      throw new Error(`Error creating subscription: ${e}`);
    }
  }
}
