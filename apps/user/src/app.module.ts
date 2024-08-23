import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigurationModule } from '../core/app-config.module';
import { CqrsModule } from '@nestjs/cqrs';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthService } from './features/auth/application/auth.service';
import { AuthQueryRepository } from './features/auth/api/query-repositories/auth.query.repo';
import { SecurityController } from './features/security/api/security.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CaptureAdapter } from '../core/adapters/capture.adapter';
import { SecurityQueryRepo } from './features/security/api/query-repositories/security.query.repo';
import { AuthController } from './features/auth/api/controllers/auth.controller';
import { PrismaModule } from '../core/db/prisma/prisma.module';
import { EmailManager } from '../core/managers/email-manager';
import { EmailAdapter } from '../core/adapters/email.adapter';
import { SAController } from './features/admin/api/controllers/sa.controller';
import { UsersQueryRepo } from './features/admin/api/query-repositories/users.query.repo';
import { SACudApiService } from './features/admin/application/sa-cud-api.service';
import { BasicSAAuthGuard } from './features/auth/infrastructure/guards/basic-auth.guard';
import { BasicSAStrategy } from './features/auth/infrastructure/guards/strategies/basic-strategy';
import { CreateSAUseCase } from './features/admin/application/use-cases/create-sa.use.case';
import { BcryptAdapter } from '../core/adapters/bcrypt.adapter';
import { UsersRepository } from './features/admin/infrastructure/users.repo';
import { CaptureGuard } from './features/auth/infrastructure/guards/validate-capture.guard';
import { VerificationCredentialsUseCase } from './features/auth/application/use-cases/verification-credentials.use-case';
import { CreateUserSessionUseCase } from './features/security/application/use-cases/create-user-session.use-case';
import { AuthRepository } from './features/auth/infrastructure/auth.repository';
import { SecurityRepository } from './features/security/infrastructure/security.repository';
import { UpdateIssuedTokenUseCase } from './features/auth/application/use-cases/update-issued-token.use-case';
import { UpdatePasswordUseCase } from './features/auth/application/use-cases/update-password.use-case';

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
    AppController,
    SecurityController,
    AuthController,
    SAController,
  ],
  providers: [
    AppService,
    AuthService,
    AuthQueryRepository,
    CaptureAdapter,
    SecurityQueryRepo,
    EmailManager,
    EmailAdapter,
    UsersQueryRepo,
    SACudApiService,
    BasicSAAuthGuard,
    BasicSAStrategy,
    CreateSAUseCase,
    BcryptAdapter,
    UsersRepository,
    CaptureGuard,
    VerificationCredentialsUseCase,
    CreateUserSessionUseCase,
    AuthRepository,
    SecurityRepository,
    UpdateIssuedTokenUseCase,
    UpdatePasswordUseCase,
  ],
})
export class AppModule {}
