import {
  EVENTS_QUEUE,
  EVENTS_SERVICE,
  FILES_SERVICE,
  RmqModule,
  TCP_FILES_SERVICE,
  TcpModule,
  TelegramModule,
  USERS_QUEUE,
} from '@app/shared';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigurationModule } from './core/configuration/app-config.module';
import { providers } from './core/configuration/app-providers';
import { DatabaseModule } from './core/db/database.module';
import { schemas } from './core/db/schemas';
import { FilesController } from './features/file/api/files.controller';

@Module({
  imports: [
    ConfigurationModule,
    CqrsModule,
    DatabaseModule,
    RmqModule.register({ name: FILES_SERVICE, queue: USERS_QUEUE }),
    RmqModule.register({ name: EVENTS_SERVICE, queue: EVENTS_QUEUE }),
    TcpModule.register({ name: TCP_FILES_SERVICE }),
    MongooseModule.forFeature(schemas),
    ScheduleModule.forRoot(),
    RmqModule,
    TcpModule,
    TelegramModule
  ],
  controllers: [FilesController],
  providers,
})
export class AppModule {}
