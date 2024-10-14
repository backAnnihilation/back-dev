import { Injectable } from '@nestjs/common';
import { Prisma, Subs } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { BaseRepository, DatabaseService } from '@user/core';
import { InputSubscriptionDto } from '../api/models/input-models/sub.model';

@Injectable()
export class SubsRepository extends BaseRepository<
  Prisma.SubsDelegate<DefaultArgs>,
  Prisma.SubsCreateInput,
  Subs
> {
  constructor(prisma: DatabaseService) {
    super(prisma.subs);
  }

  async getSubscription(subDto: InputSubscriptionDto) {
    try {
      return await this.prismaModel.findFirst({
        where: { ...subDto },
      });
    } catch (e) {
      return null;
    }
  }

  async create(subDto: InputSubscriptionDto) {
    try {
      return await this.prismaModel.create({
        data: { ...subDto },
      });
    } catch (e) {
      throw new Error(`Error creating subscription: ${e}`);
    }
  }

  async delete(id: string): Promise<Subs> {
    try {
      return await this.prismaModel.delete({
        where: { id },
      });
    } catch (e) {
      throw new Error('Error deleting subscription');
    }
  }
}
