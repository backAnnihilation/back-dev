import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CustomThrottlerGuard } from '../../../../../core/infrastructure/guards/custom-throttler.guard';
import { AuthNavigate } from '../../../../../core/routes/auth-navigate';
import { UserSessionDto } from '../../../security/api/models/security-input.models/security-session-info.model';
import { CreateSessionCommand } from '../../../security/application/use-cases/commands/create-session.command';
import { DeleteActiveSessionCommand } from '../../../security/application/use-cases/commands/delete-active-session.command';
import { AuthenticationApiService } from '../../application/auth-token-response.service';
import { ConfirmEmailCommand } from '../../application/use-cases/commands/confirm-email.command';
import { CreateUserCommand } from '../../application/use-cases/commands/create-user.command';
import { PasswordRecoveryCommand } from '../../application/use-cases/commands/password-recovery.command';
import { UpdateConfirmationCodeCommand } from '../../application/use-cases/commands/update-confirmation-code.command';
import { UpdateIssuedTokenCommand } from '../../application/use-cases/commands/update-Issued-token.command';
import { UpdatePasswordCommand } from '../../application/use-cases/commands/update-password.command';
import { CreateOAuthUserCommand } from '../../application/use-cases/create-oauth-user.use-case';
import { GetClientInfo } from '../../infrastructure/decorators/client-ip.decorator';
import { UserOauthProvider } from '../../infrastructure/decorators/user-oauth.decorator';
import { UserPayload } from '../../infrastructure/decorators/user-payload.decorator';
import { AccessTokenGuard } from '../../infrastructure/guards/accessToken.guard';
import { GithubOauthGuard } from '../../infrastructure/guards/github-oauth.guard';
import { GoogleOauthGuard } from '../../infrastructure/guards/google-oauth.guard';
import { LocalAuthGuard } from '../../infrastructure/guards/local-auth.guard';
import { RefreshTokenGuard } from '../../infrastructure/guards/refreshToken.guard';
import { CaptureGuard } from '../../infrastructure/guards/validate-capture.guard';
import { ClientInfo } from '../models/auth-input.models.ts/client-info.type';
import {
  InputEmailDto,
  RecoveryPasswordDto,
} from '../models/auth-input.models.ts/password-recovery.types';
import {
  IGithubProvider,
  IGoogleProvider,
} from '../models/auth-input.models.ts/provider-user-info';
import { RecoveryPassDto } from '../models/auth-input.models.ts/recovery.model';
import { RegistrationCodeDto } from '../models/auth-input.models.ts/registration-code.model';
import { CreateUserDto } from '../models/auth-input.models.ts/user-registration.model';
import { UserCredentialsDto } from '../models/auth-input.models.ts/verify-credentials.model';
import { UserProfileType } from '../models/auth.output.models/auth.output.models';
import { AuthQueryRepository } from '../query-repositories/auth.query.repo';
import { ConfirmPasswordEndpoint } from '../swagger/confirm-password-recovery.description';
import { GetProfileEndpoint } from '../swagger/get-user-profile.description';
import { PasswordRecoveryEndpoint } from '../swagger/recovery-password.description';
import { RefreshTokenEndpoint } from '../swagger/refresh-token.description';
import { RegistrationConfirmationEndpoint } from '../swagger/registration-confirmation.description';
import { RegistrationEmailResendingEndpoint } from '../swagger/registration-email-resending.description';
import {
  ApiTagsEnum,
  RoutingEnum,
} from '../../../../../../../libs/shared/routing';
import { GithubOauthEndpoint } from '../swagger/github.description';
import { GoogleOauthEndpoint } from '../swagger/google.description';
import { LogoutEndpoint } from '../swagger/logout-description';
import { SignInEndpoint } from '../swagger/sign-in.description';
import { SignUpEndpoint } from '../swagger/sign-up.description';

@ApiTags(ApiTagsEnum.Auth)
@Controller(RoutingEnum.auth)
export class AuthController {
  constructor(
    private authQueryRepo: AuthQueryRepository,
    private authenticationApiService: AuthenticationApiService,
  ) {}

  @SignInEndpoint()
  @UseGuards(CustomThrottlerGuard, LocalAuthGuard, CaptureGuard)
  @HttpCode(HttpStatus.OK)
  @Post(AuthNavigate.Login)
  async login(
    @UserPayload() userInfo: UserSessionDto,
    @GetClientInfo() clientInfo: ClientInfo,
    @Res({ passthrough: true }) res: Response,
    @Body() body: UserCredentialsDto,
  ) {
    const command = new CreateSessionCommand({
      clientInfo,
      userId: userInfo.userId,
    });
    const { accessToken, refreshToken } =
      await this.authenticationApiService.authOperation(command);

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });

    return { accessToken };
  }

  @SignUpEndpoint()
  @Post(AuthNavigate.Registration)
  @UseGuards(CaptureGuard, CustomThrottlerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async registration(@Body() data: CreateUserDto) {
    const command = new CreateUserCommand(data);
    await this.authenticationApiService.authOperation(command);
  }

  @RefreshTokenEndpoint()
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Post(AuthNavigate.RefreshToken)
  async refreshToken(
    @UserPayload() userInfo: UserSessionDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const command = new UpdateIssuedTokenCommand(userInfo);
    const { accessToken, refreshToken } =
      await this.authenticationApiService.authOperation(command);

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
    return { accessToken };
  }

  @GetProfileEndpoint()
  @UseGuards(AccessTokenGuard)
  @Get(AuthNavigate.GetProfile)
  async getProfile(
    @UserPayload() userInfo: UserSessionDto,
  ): Promise<UserProfileType> {
    const user = await this.authQueryRepo.getById(userInfo.userId);

    if (!user) throw new NotFoundException('User not found');

    const { email, userName, id: userId } = user.accountData;

    return { email, userName, userId };
  }

  @LogoutEndpoint()
  @UseGuards(RefreshTokenGuard)
  @Post(AuthNavigate.Logout)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@UserPayload() userInfo: UserSessionDto) {
    const command = new DeleteActiveSessionCommand(userInfo);
    await this.authenticationApiService.authOperation(command);
  }

  @PasswordRecoveryEndpoint()
  @UseGuards(CustomThrottlerGuard, CaptureGuard)
  @Post(AuthNavigate.PasswordRecovery)
  @HttpCode(HttpStatus.NO_CONTENT)
  async passwordRecovery(@Body() data: RecoveryPasswordDto): Promise<void> {
    const command = new PasswordRecoveryCommand(data);
    await this.authenticationApiService.authOperation(command);
  }

  @ConfirmPasswordEndpoint()
  @UseGuards(CustomThrottlerGuard, CaptureGuard)
  @Post(AuthNavigate.NewPassword)
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmPasswordRecovery(@Body() body: RecoveryPassDto) {
    const command = new UpdatePasswordCommand(body);
    await this.authenticationApiService.authOperation(command);
  }

  @RegistrationConfirmationEndpoint()
  @UseGuards(CustomThrottlerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post(AuthNavigate.RegistrationConfirmation)
  async registrationConfirmation(@Body() data: RegistrationCodeDto) {
    const command = new ConfirmEmailCommand(data);
    await this.authenticationApiService.authOperation(command);
  }

  @RegistrationEmailResendingEndpoint()
  @UseGuards(CustomThrottlerGuard)
  @Post(AuthNavigate.RegistrationEmailResending)
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationEmailResending(@Body() data: InputEmailDto) {
    const command = new UpdateConfirmationCodeCommand(data);
    await this.authenticationApiService.authOperation(command);
  }

  @GithubOauthEndpoint()
  @Get(AuthNavigate.GithubLogin)
  @UseGuards(GithubOauthGuard)
  githubAuth() {}

  @Get(AuthNavigate.GithubCallback)
  @UseGuards(GithubOauthGuard)
  async githubLogin(
    @Res({ passthrough: true }) res: Response,
    @UserOauthProvider() provider: IGithubProvider,
  ) {
    const command = new CreateOAuthUserCommand(provider);
    const { accessToken, refreshToken } =
      await this.authenticationApiService.authOperation(command);
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
    return { accessToken };
  }

  @GoogleOauthEndpoint()
  @Get(AuthNavigate.GoogleLogin)
  @UseGuards(GoogleOauthGuard)
  googleAuth() {}

  @Get(AuthNavigate.GoogleRedirect)
  @UseGuards(GoogleOauthGuard)
  async googleLogin(
    @Res({ passthrough: true }) res: Response,
    @UserOauthProvider() provider: IGoogleProvider,
  ) {
    const command = new CreateOAuthUserCommand(provider);
    const { accessToken, refreshToken } =
      await this.authenticationApiService.authOperation(command);
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
    return { accessToken };
  }
}
