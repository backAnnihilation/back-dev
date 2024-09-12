import { Provider } from '@nestjs/common';
import { UsersQueryRepo } from '../../features/admin/api/query-repositories/user-account.query.repo';
import { SACudApiService } from '../../features/admin/application/sa-cud-api.service';
import { CreateSAUseCase } from '../../features/admin/application/use-cases/create-sa.use.case';
import { CleanUpDatabaseRepository } from '../../features/admin/infrastructure/clean-up.repo';
import { UsersRepository } from '../../features/admin/infrastructure/users.repo';
import { AuthQueryRepository } from '../../features/auth/api/query-repositories/auth.query.repo';
import { AuthenticationApiService } from '../../features/auth/application/auth-token-response.service';
import { AuthService } from '../../features/auth/application/auth.service';
import { ConfirmRegistrationUseCase } from '../../features/auth/application/use-cases/confirm-registration.use-case';
import { CreateOAuthUserUseCase } from '../../features/auth/application/use-cases/create-oauth-user.use-case';
import { CreateUserUseCase } from '../../features/auth/application/use-cases/create-user.use-case';
import { UserCreatedNoticeEventHandler } from '../../features/auth/application/use-cases/events/handlers/user-created-notification.event-handler';
import { EmailNotificationOauthEventHandler } from '../../features/auth/application/use-cases/events/handlers/user-oauth-created-notification.event-handler';
import { PasswordRecoveryUseCase } from '../../features/auth/application/use-cases/password-recovery.use-case';
import { SendRecoveryMessageEventHandler } from '../../features/auth/application/use-cases/send-recovery-msg.event';
import { UpdateConfirmationCodeUseCase } from '../../features/auth/application/use-cases/update-confirmation-code.use-case';
import { UpdateIssuedTokenUseCase } from '../../features/auth/application/use-cases/update-issued-token.use-case';
import { UpdatePasswordUseCase } from '../../features/auth/application/use-cases/update-password.use-case';
import { VerificationCredentialsUseCase } from '../../features/auth/application/use-cases/verification-credentials.use-case';
import { UserService } from '../../features/auth/application/user.service';
import { AuthRepository } from '../../features/auth/infrastructure/auth.repository';
import { BasicSAAuthGuard } from '../../features/auth/infrastructure/guards/basic-auth.guard';
import { AccessTokenStrategy } from '../../features/auth/infrastructure/guards/strategies/access-token.strategy';
import { BasicSAStrategy } from '../../features/auth/infrastructure/guards/strategies/basic.strategy';
import { GithubStrategy } from '../../features/auth/infrastructure/guards/strategies/github.strategy';
import { GoogleStrategy } from '../../features/auth/infrastructure/guards/strategies/google.strategy';
import { LocalStrategy } from '../../features/auth/infrastructure/guards/strategies/local.strategy';
import { RefreshTokenStrategy } from '../../features/auth/infrastructure/guards/strategies/refresh-token.strategy';
import { CaptureGuard } from '../../features/auth/infrastructure/guards/validate-capture.guard';
import { ProfilesQueryRepo } from '../../features/profile/api/query-repositories/profiles.query.repo';
import { UserProfileService } from '../../features/profile/application/services/profile.service';
import { UserProfilesApiService } from '../../features/profile/application/services/user-api.service';
import { EditProfileUseCase } from '../../features/profile/application/use-cases/edit-profile.use-case';
import { FillOutProfileUseCase } from '../../features/profile/application/use-cases/fill-out-profile.use-case';
import { ProfilesRepository } from '../../features/profile/infrastructure/profiles.repository';
import { ImageFilePipe } from '../../features/profile/infrastructure/validation/upload-photo-format';
import { SecurityQueryRepo } from '../../features/security/api/query-repositories/security.query.repo';
import { CreateUserSessionUseCase } from '../../features/security/application/use-cases/create-user-session.use-case';
import { DeleteActiveSessionUseCase } from '../../features/security/application/use-cases/delete-active-session.use-case';
import { DeleteOtherUserSessionsUseCase } from '../../features/security/application/use-cases/delete-other-user-sessions.use-case';
import { SecurityRepository } from '../../features/security/infrastructure/security.repository';
import { AxiosAdapter } from '../adapters/axios.adapter';
import { BcryptAdapter } from '../adapters/bcrypt.adapter';
import { CaptureAdapter } from '../adapters/capture.adapter';
import { EmailAdapter } from '../adapters/email.adapter';
import { RMQAdapter } from '../adapters/rmq.adapter';
import { EmailManager } from '../managers/email-manager';
import { PostQueryRepo } from '../../features/post/api/query-repositories/post.query.repo';
import { UserPostApiService } from '../../features/post/application/services/post-api.service';
import { CreatePostUseCase } from '../../features/post/application/use-cases/create-post.use-case';
import { EditPostUseCase } from '../../features/post/application/use-cases/edit-post.use-case';
import { PostsRepository } from '../../features/post/infrastructure/posts.repo';
import { DeletePostUseCase } from '../../features/post/application/use-cases/delete-post.use-case';

const adapters: Provider[] = [
  BcryptAdapter,
  CaptureAdapter,
  EmailAdapter,
  RMQAdapter,
  AxiosAdapter,
];

export const providers: Provider[] = [
  ...adapters,
  AuthService,
  UserService,
  AuthQueryRepository,
  CleanUpDatabaseRepository,
  SecurityQueryRepo,
  EmailManager,
  UsersQueryRepo,
  SACudApiService,
  BasicSAAuthGuard,
  BasicSAStrategy,
  LocalStrategy,
  CreateSAUseCase,
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
  ImageFilePipe,
  UserProfileService,
  DeletePostUseCase,
  CreatePostUseCase,
  // {
  //   provide: 'FILES_SERVICE',
  //   useFactory: (configService: ConfigService<RmqConfig>) => {
  //     const { url, queueName: queue } = configService.getOrThrow('rmq');
  //     const rmqOption: RmqOptions = {
  //       transport: Transport.RMQ,
  //       options: {
  //         urls: [url],
  //         queue,
  //         queueOptions: {
  //           durable: true,
  //         },
  //       },
  //     };
  //     return ClientProxyFactory.create(rmqOption);
  //   },
  //   inject: [ConfigService],
  // },
];
