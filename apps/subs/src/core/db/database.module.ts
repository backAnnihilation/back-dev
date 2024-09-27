import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { getConnection } from '@subs/core/db/db.connection';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useFactory: getConnection,
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
