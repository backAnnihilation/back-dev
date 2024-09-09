import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { EnvironmentVariables } from '../../config/configuration';
import { Environment } from '../../../../../libs/shared/environment.enum';

@Injectable()
export class DatabaseService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(configService: ConfigService<EnvironmentVariables>) {
    super({
      datasourceUrl:
        configService.get('ENV') === Environment.TESTING
          ? configService.get('DATABASE_URL_FOR_TESTS')
          : configService.get('DATABASE_URL'),
    });
  }
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
