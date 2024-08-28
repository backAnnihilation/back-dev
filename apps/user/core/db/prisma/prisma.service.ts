import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
async onModuleInit() {
    try {
      await this.$connect();
    } catch (error) {
      console.error('prisma connection failed', error);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
