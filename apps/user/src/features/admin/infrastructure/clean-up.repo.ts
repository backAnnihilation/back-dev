import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { Environment } from '@app/shared';
import { EnvironmentVariables, DatabaseService } from '@user/core';

@Injectable()
export class CleanUpDatabaseRepository {
  constructor(
    private prisma: DatabaseService,
    private config: ConfigService<EnvironmentVariables>,
  ) {}

  async clearDatabase(): Promise<any> {
    const env = this.config.get('ENV');
    if (env !== Environment.TESTING) {
      new Error('Not in testing environment');
    }

    try {
      const tableNames = Object.values(Prisma.ModelName);
      for (const tableName of tableNames) {
        await this.prisma.$queryRawUnsafe(
          `TRUNCATE TABLE "${tableName}" RESTART IDENTITY CASCADE`,
        );
        console.log(`Truncated ${tableName} table`);
      }
    } catch (error) {
      throw new Error(`Error in clearDatabase: ${error}`);
    }
  }
}
