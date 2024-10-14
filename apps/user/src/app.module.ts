import {
  EVENTS_QUEUE,
  EVENTS_SERVICE,
  FILES_QUEUE,
  FILES_SERVICE,
  RmqModule,
  TCP_FILES_SERVICE,
  TcpModule,
} from '@app/shared';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigurationModule } from './core/config/app-config.module';
import { providers } from './core/config/app-providers';
import { PrismaModule } from './core/db/prisma/prisma.module';
import { SAController } from './features/admin/api/controllers/sa.controller';
import { AuthController } from './features/auth/api/controllers/auth.controller';
import { PostsController } from './features/post/api/controllers/posts.controller';
import { UserProfilesController } from './features/profile/api/profiles.controller';
import { SecurityController } from './features/security/api/security.controller';
import { SubsController } from './features/subs/api/subs.controller';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    JwtModule.register({}),
    RmqModule.register({ name: FILES_SERVICE, queue: FILES_QUEUE }),
    TcpModule.register({ name: TCP_FILES_SERVICE }),
    RmqModule.register({ name: EVENTS_SERVICE, queue: EVENTS_QUEUE }),
    ThrottlerModule.forRoot([{ limit: 20, ttl: Math.pow(20, 3) }]),
    ScheduleModule.forRoot(),
    PassportModule,
    ConfigurationModule,
    CqrsModule,
    PrismaModule,
  ],
  controllers: [
    SubsController,
    SecurityController,
    AuthController,
    SAController,
    UserProfilesController,
    PostsController,
  ],
  providers,
})
export class AppModule {}
