import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ThrottlerModule } from '@nestjs/throttler';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SecurityController } from './features/security/api/security.controller';
import { ConfigurationModule } from './core/config/app-config.module';
import { AuthController } from './features/auth/api/controllers/auth.controller';
import { PrismaModule } from './core/db/prisma/prisma.module';
import { SAController } from './features/admin/api/controllers/sa.controller';
import { providers } from './core/settings/app-providers';
import { UserProfilesController } from './features/profile/api/profiles.controller';
import { PostModule } from './features/post/post.module';
import { PostsController } from './features/post/api/post.controller';
import { UserPostApiService } from './features/post/application/services/post-api.service';

@Module({
  imports: [
    JwtModule.register({}),
    PassportModule,
    ConfigurationModule,
    CqrsModule,
    PostModule,
    PrismaModule,
    ThrottlerModule.forRoot([{ limit: 20, ttl: Math.pow(20, 3) }]),
  ],
  controllers: [
    SecurityController,
    AuthController,
    SAController,
    UserProfilesController,
    PostsController,
    // UserPostApiService,
  ],
  providers,
})
export class AppModule {}
