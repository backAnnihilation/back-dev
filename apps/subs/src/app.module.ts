import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ScheduleModule } from '@nestjs/schedule';
import { SequelizeModule } from '@nestjs/sequelize';

import { RmqModule } from '@app/shared';

import { ConfigurationModule } from './core/configuration/app-config.module';
import { providers } from './core/configuration/app-providers';
import { DatabaseModule } from './core/db/database.module';
import { SubsController } from './features/subs/api/subs.controller';
import { UserSubscription } from './features/subs/domain/entities/subs.table';

@Module({
  imports: [
    ConfigurationModule,
    CqrsModule,
    DatabaseModule,
    SequelizeModule.forFeature([UserSubscription]),
    ScheduleModule.forRoot(),
    RmqModule,
  ],
  controllers: [SubsController],
  providers,
})
export class AppModule {}
