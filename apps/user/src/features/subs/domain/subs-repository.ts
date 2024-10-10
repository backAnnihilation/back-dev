import { Injectable } from '@nestjs/common';
import { Prisma, Subs } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { BaseRepository, DatabaseService } from '@user/core';
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
        where: { ...subDto },
      });
    } catch (e) {
      return null;
    }
  }

  async create(subDto: InputSubscriptionDto) {
    try {
      return await this.subs.create({
        data: { ...subDto },
      });
    } catch (e) {
      console.error('Error creating subscription', e);
      return null;
    }
  }

  async delete(id: string): Promise<Subs> {
    try {
      return await this.subs.delete({
        where: { id },
      });
    } catch (e) {
      throw new Error('Error deleting subscription');
    }
  }
}
