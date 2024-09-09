import { Module } from '@nestjs/common';
import { ConfigurationModule } from '../core/config/app-config.module';
import { CqrsModule } from '@nestjs/cqrs';
import { ThrottlerModule } from '@nestjs/throttler';
import { SecurityController } from './features/security/api/security.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './features/auth/api/controllers/auth.controller';
import { PrismaModule } from '../core/db/prisma/prisma.module';
import { SAController } from './features/admin/api/controllers/sa.controller';
import { providers } from '../core/settings/app-providers';
import { UserProfilesController } from './features/user/api/profiles.controller';
import { UserPostsController } from './features/post/api/posts.controller';

@Module({
  imports: [
    JwtModule.register({}),
    PassportModule,
    ConfigurationModule,
    CqrsModule,
    PrismaModule,
    ThrottlerModule.forRoot([{ limit: 20, ttl: Math.pow(20, 3) }]),
  ],
  controllers: [
    SecurityController,
    AuthController,
    SAController,
    UserProfilesController,
    UserPostsController,
  ],
  providers,
})
export class AppModule {}
