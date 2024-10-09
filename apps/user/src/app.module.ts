import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ThrottlerModule } from '@nestjs/throttler';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import {
  QUEUE_NAME,
  QUEUE_TOKEN,
  RmqModule,
  SERVICE_TOKEN,
  TcpModule,
} from '@app/shared';
import { SecurityController } from './features/security/api/security.controller';
import { ConfigurationModule } from './core/config/app-config.module';
import { AuthController } from './features/auth/api/controllers/auth.controller';
import { PrismaModule } from './core/db/prisma/prisma.module';
import { SAController } from './features/admin/api/controllers/sa.controller';
import { providers } from './core/config/app-providers';
import { UserProfilesController } from './features/profile/api/profiles.controller';
import { PostsController } from './features/post/api/controllers/posts.controller';
import { SubsController } from './features/subs/api/subs.controller';

@Module({
  imports: [
    JwtModule.register({}),
    RmqModule.register({ name: QUEUE_NAME.FILES }),
    TcpModule.register({ name: SERVICE_TOKEN.FILES }),
    ThrottlerModule.forRoot([{ limit: 20, ttl: Math.pow(20, 3) }]),
    PassportModule,
    ConfigurationModule,
    CqrsModule,
    PrismaModule,
  ],
  controllers: [
    SecurityController,
    AuthController,
    SAController,
    UserProfilesController,
    PostsController,
    SubsController,
  ],
  providers,
})
export class AppModule {}
