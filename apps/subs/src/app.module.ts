import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ScheduleModule } from '@nestjs/schedule';

import { RmqModule } from '@app/shared';

import { ConfigurationModule } from './core/configuration/app-config.module';
import { providers } from './core/configuration/app-providers';
import { DatabaseModule } from './core/db/database.module';

@Module({
  imports: [
    ConfigurationModule,
    CqrsModule,
    DatabaseModule,
    ScheduleModule.forRoot(),
    RmqModule,
  ],
  controllers: [],
  providers,
})
export class AppModule {}
