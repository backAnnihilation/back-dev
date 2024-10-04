import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';

import { getConnection } from '@subs/core/db/db.connection';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useFactory: getConnection,
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
