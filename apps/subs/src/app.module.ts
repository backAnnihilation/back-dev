import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { RmqModule, TcpModule } from '@app/shared';
import { ConfigurationModule } from './core/configuration/app-config.module';
import { providers } from './core/configuration/app-providers';
import { DatabaseModule } from './core/db/database.module';
import { schemas } from './core/db/schemas';
import { SubsController } from './features/subs/api/subs.controller';

@Module({
  imports: [
    ConfigurationModule,
    CqrsModule,
    DatabaseModule,
    ScheduleModule.forRoot(),
    RmqModule,
    TcpModule,
  ],
  controllers: [SubsController],
  providers,
})
export class AppModule {}
