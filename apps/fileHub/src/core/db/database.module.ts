import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { getConnection } from './db.connection';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: getConnection,
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
