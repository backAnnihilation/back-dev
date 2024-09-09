import { Provider } from '@nestjs/common';
import { UsersQueryRepo } from '../../src/features/admin/api/query-repositories/user-account.query.repo';
import { SACudApiService } from '../../src/features/admin/application/sa-cud-api.service';
import { CreateSAUseCase } from '../../src/features/admin/application/use-cases/create-sa.use.case';
import { UsersRepository } from '../../src/features/admin/infrastructure/users.repo';
import { AuthQueryRepository } from '../../src/features/auth/api/query-repositories/auth.query.repo';
import { AuthenticationApiService } from '../../src/features/auth/application/auth-token-response.service';
import { AuthService } from '../../src/features/auth/application/auth.service';
import { ConfirmRegistrationUseCase } from '../../src/features/auth/application/use-cases/confirm-registration.use-case';
import { CreateOAuthUserUseCase } from '../../src/features/auth/application/use-cases/create-oauth-user.use-case';
import { CreateUserUseCase } from '../../src/features/auth/application/use-cases/create-user.use-case';
import { UserCreatedNoticeEventHandler } from '../../src/features/auth/application/use-cases/events/handlers/user-created-notification.event-handler';
import { EmailNotificationOauthEventHandler } from '../../src/features/auth/application/use-cases/events/handlers/user-oauth-created-notification.event-handler';
import { PasswordRecoveryUseCase } from '../../src/features/auth/application/use-cases/password-recovery.use-case';
import { SendRecoveryMessageEventHandler } from '../../src/features/auth/application/use-cases/send-recovery-msg.event';
import { UpdateConfirmationCodeUseCase } from '../../src/features/auth/application/use-cases/update-confirmation-code.use-case';
import { UpdateIssuedTokenUseCase } from '../../src/features/auth/application/use-cases/update-issued-token.use-case';
import { UpdatePasswordUseCase } from '../../src/features/auth/application/use-cases/update-password.use-case';
import { VerificationCredentialsUseCase } from '../../src/features/auth/application/use-cases/verification-credentials.use-case';
import { UserService } from '../../src/features/auth/application/user.service';
import { AuthRepository } from '../../src/features/auth/infrastructure/auth.repository';
import { BasicSAAuthGuard } from '../../src/features/auth/infrastructure/guards/basic-auth.guard';
import { AccessTokenStrategy } from '../../src/features/auth/infrastructure/guards/strategies/access-token.strategy';
import { BasicSAStrategy } from '../../src/features/auth/infrastructure/guards/strategies/basic.strategy';
import { GithubStrategy } from '../../src/features/auth/infrastructure/guards/strategies/github.strategy';
import { GoogleStrategy } from '../../src/features/auth/infrastructure/guards/strategies/google.strategy';
import { LocalStrategy } from '../../src/features/auth/infrastructure/guards/strategies/local.strategy';
import { RefreshTokenStrategy } from '../../src/features/auth/infrastructure/guards/strategies/refresh-token.strategy';
import { CaptureGuard } from '../../src/features/auth/infrastructure/guards/validate-capture.guard';
import { SecurityQueryRepo } from '../../src/features/security/api/query-repositories/security.query.repo';
import { CreateUserSessionUseCase } from '../../src/features/security/application/use-cases/create-user-session.use-case';
import { DeleteActiveSessionUseCase } from '../../src/features/security/application/use-cases/delete-active-session.use-case';
import { DeleteOtherUserSessionsUseCase } from '../../src/features/security/application/use-cases/delete-other-user-sessions.use-case';
import { SecurityRepository } from '../../src/features/security/infrastructure/security.repository';
import { BcryptAdapter } from '../adapters/bcrypt.adapter';
import { CaptureAdapter } from '../adapters/capture.adapter';
import { EmailAdapter } from '../adapters/email.adapter';
import { EmailManager } from '../managers/email-manager';
import { ProfilesQueryRepo } from '../../src/features/user/api/query-repositories/profiles.query.repo';
import { ProfilesRepository } from '../../src/features/user/infrastructure/profiles.repository';
import { FillOutProfileUseCase } from '../../src/features/user/application/use-cases/fill-out-profile.use-case';
import { EditProfileUseCase } from '../../src/features/user/application/use-cases/edit-profile.use-case';
import { ImageFilePipe } from '../../src/features/user/infrastructure/validation/upload-photo-format';
import { AxiosAdapter } from '../adapters/axios.adapter';
import { CleanUpDatabaseRepository } from '../../src/features/admin/infrastructure/clean-up.repo';
import { UserProfileService } from '../../src/features/user/application/services/profile.service';
import { UserProfilesApiService } from '../../src/features/user/application/services/user-api.service';
import { UserPostApiService } from '../../src/features/post/application/services/user-api.service';
import { PostQueryRepo } from '../../src/features/post/api/query-repositories/post.query.repo';
import { EditPostUseCase } from '../../src/features/post/application/use-cases/edit-post.use-case';
import { PostsRepository } from '../../src/features/admin/infrastructure/posts.repo';
import { DeletePostUseCase } from '../../src/features/post/application/use-cases/delete-post.use-case';
import { CreatePostUseCase } from '../../src/features/post/application/use-cases/create-post.use-case';

export const providers: Provider[] = [
  AuthService,
  UserService,
  AuthQueryRepository,
  CleanUpDatabaseRepository,
  CaptureAdapter,
  AxiosAdapter,
  SecurityQueryRepo,
  EmailManager,
  EmailAdapter,
  UsersQueryRepo,
  SACudApiService,
  BasicSAAuthGuard,
  BasicSAStrategy,
  LocalStrategy,
  CreateSAUseCase,
  BcryptAdapter,
  UsersRepository,
  PostsRepository,
  CaptureGuard,
  VerificationCredentialsUseCase,
  CreateUserSessionUseCase,
  CreateUserUseCase,
  AuthRepository,
  SecurityRepository,
  UpdateIssuedTokenUseCase,
  UpdatePasswordUseCase,
  SendRecoveryMessageEventHandler,
  UserCreatedNoticeEventHandler,
  UpdateConfirmationCodeUseCase,
  DeleteActiveSessionUseCase,
  ConfirmRegistrationUseCase,
  AuthenticationApiService,
  UserProfilesApiService,
  UserPostApiService,
  AccessTokenStrategy,
  RefreshTokenStrategy,
  GithubStrategy,
  GoogleStrategy,
  PasswordRecoveryUseCase,
  DeleteOtherUserSessionsUseCase,
  EmailNotificationOauthEventHandler,
  CreateOAuthUserUseCase,
  ProfilesQueryRepo,
  PostQueryRepo,
  ProfilesRepository,
  FillOutProfileUseCase,
  EditProfileUseCase,
  EditPostUseCase,
  DeletePostUseCase,
  CreatePostUseCase,
  ImageFilePipe,
  UserProfileService,
];
