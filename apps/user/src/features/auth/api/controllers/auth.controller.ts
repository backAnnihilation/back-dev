import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ClientInfo } from '../models/auth-input.models.ts/client-info.type';
import { UserCredentialsWithCaptureTokenDto } from '../models/auth-input.models.ts/verify-credentials.model';
import { ApiTagsEnum, RoutingEnum } from '../../../../../core/routes/routing';
import { LocalAuthGuard } from '../../infrastructure/guards/local-auth.guard';
import { CustomThrottlerGuard } from '../../../../../core/infrastructure/guards/custom-throttler.guard';
import { AuthNavigate } from '../../../../../core/routes/auth-navigate';
import { SignInEndpoint } from './swagger/signIn/signIn.description';
import { CommandBus } from '@nestjs/cqrs';
import { AuthService } from '../../application/auth.service';
import { ConfirmEmailCommand } from '../../application/use-cases/commands/confirm-email.command';
import { CreateTemporaryAccountCommand } from '../../application/use-cases/commands/create-temp-account.command';
import { CreateUserCommand } from '../../application/use-cases/commands/create-user.command';
import { PasswordRecoveryCommand } from '../../application/use-cases/commands/recovery-password.command';
import { UpdateConfirmationCodeCommand } from '../../application/use-cases/commands/update-confirmation-code.command';
import { UpdateIssuedTokenCommand } from '../../application/use-cases/commands/update-Issued-token.command';
import { UpdatePassTempAccountCommand } from '../../application/use-cases/commands/update-password-temporary-account.command';
import { UpdatePasswordCommand } from '../../application/use-cases/commands/update-password.command';
import { GetClientInfo } from '../../infrastructure/decorators/client-ip.decorator';
import { UserPayload } from '../../infrastructure/decorators/user-payload.decorator';
import { AccessTokenGuard } from '../../infrastructure/guards/accessToken.guard';
import { RefreshTokenGuard } from '../../infrastructure/guards/refreshToken.guard';
import { RegistrationEmailDto } from '../models/auth-input.models.ts/password-recovery.types';
import { RecoveryPassDto } from '../models/auth-input.models.ts/recovery.model';
import { RegistrationCodeDto } from '../models/auth-input.models.ts/registration-code.model';
import { CreateUserDto } from '../models/auth-input.models.ts/user-registration.model';
import { UserProfileType } from '../models/auth.output.models/auth.output.models';
import { AuthQueryRepository } from '../query-repositories/auth.query.repo';
import { UserSessionDto } from '../../../security/api/models/security-input.models/security-session-info.model';
import { CreateSessionCommand } from '../../../security/application/use-cases/commands/create-session.command';
import { LayerNoticeInterceptor } from '../../../../../core/utils/notification';
import { OutputId } from '../../../../../core/api/dto/output-id.dto';
import { handleErrors } from '../../../../../core/utils/handle-response-errors';
import { extractDeviceInfo } from '../../infrastructure/utils/device-info-extractor';
import { DeleteActiveSessionCommand } from '../../../security/application/use-cases/commands/delete-active-session.command';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ErrorType,
  makeErrorsMessages,
} from '../../../../../core/utils/error-handler';
import { Response } from 'express';
import { CaptureGuard } from '../../infrastructure/guards/validate-capture.guard';
import { RefreshTokenEndpoint } from './swagger/refresh-token.description';
import { ErrorMessageDto } from './swagger/shared/error-message-response';
import { AccessTokenResponseDto } from './swagger/shared/accessToken-response.dto';

class UserInfoDto {
  login: string;
  email: string;
  userId: string;
}

// todo Response from express doesn't work
@ApiTags(ApiTagsEnum.Auth)
@Controller(RoutingEnum.auth)
export class AuthController {
  constructor(
    private authQueryRepo: AuthQueryRepository,
    private authService: AuthService,
    private commandBus: CommandBus,
    // private readonly blogsCrudApiService: BlogsCUDApiService,
  ) {}

  // todo authCUDService
  @SignInEndpoint()
  @ApiOperation({
    summary: 'Логин юзера с каптчей',
    description: 'авторизация с капчей.',
  })
  @ApiResponse({
    status: 429,
    description: 'More than 20 attempts from one IP-address during 20 seconds',
  })
  @ApiResponse({ status: 400, type: ErrorMessageDto })
  @ApiResponse({
    status: 200,
    description: 'Успешный логин',
    type: AccessTokenResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Неверные учетные данные' })
  @ApiBody({ type: UserCredentialsWithCaptureTokenDto })
  @UseGuards(CustomThrottlerGuard, LocalAuthGuard, CaptureGuard)
  @HttpCode(HttpStatus.OK)
  @Post(AuthNavigate.Login)
  async login(
    @UserPayload() userInfo: UserSessionDto,
    @GetClientInfo() clientInfo: ClientInfo,
    @Res({ passthrough: true }) res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() body: UserCredentialsWithCaptureTokenDto,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.createTokenPair(userInfo.userId);

    const userPayload = this.authService.getUserPayloadByToken(refreshToken);

    if (!userPayload) throw new Error();

    const { browser, deviceType } = extractDeviceInfo(clientInfo.userAgentInfo);

    const command = new CreateSessionCommand({
      userPayload,
      browser,
      deviceType,
      ipAddress: clientInfo.ip,
      userId: userInfo.userId,
      refreshToken,
    });

    const result = await this.commandBus.execute<
      CreateSessionCommand,
      LayerNoticeInterceptor<OutputId>
    >(command);

    if (result.hasError) {
      const errors = handleErrors(result.code, result.extensions[0]);
      throw errors.error;
    }

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });

    // res.header('accessToken', accessToken);
    return { accessToken };
  }

  @ApiOperation({
    summary: 'регистрация',
    description: 'жесткая логика регистрации',
  })
  @ApiResponse({
    status: 429,
    description: 'More than 20 attempts from one IP-address during 20 seconds',
  })
  @ApiResponse({ status: 400, type: ErrorMessageDto })
  @ApiResponse({ status: 204, description: 'Зарегался' })
  @ApiBody({ type: UserCredentialsWithCaptureTokenDto })
  @Post(AuthNavigate.Registration)
  @UseGuards(CustomThrottlerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async registration(
    @Body() data: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { userName, email } = data;

    const foundUser = await this.authQueryRepo.findByEmailAndName({
      userName,
      email,
    });

    if (foundUser) {
      let errors: ErrorType;

      if (foundUser.accountData.email === email) {
        errors = makeErrorsMessages('email');
      }
      res.status(HttpStatus.BAD_REQUEST).send(errors!);
      return;
    }

    const command = new CreateUserCommand(data);

    const resultNotification = await this.commandBus.execute(command);
    return resultNotification.data;
  }
  @ApiOperation({
    summary: 'восстановить пароль',
    description: 'туда сюда пароль здесь',
  })
  @ApiResponse({
    status: 429,
    description: 'More than 20 attempts from one IP-address during 20 seconds',
  })
  @ApiResponse({
    status: 400,
    description:
      'If the inputModel has invalid email (for example 222^gmail.com)',
    type: ErrorMessageDto,
  })
  @ApiResponse({
    status: 204,
    description:
      'Even if current email is not registered (for prevent user`s email detection)',
    type: RegistrationEmailDto,
  })
  @ApiBody({ type: RegistrationEmailDto })
  @UseGuards(CustomThrottlerGuard)
  @Post(AuthNavigate.PasswordRecovery)
  @HttpCode(HttpStatus.NO_CONTENT)
  async recoveryPassword(@Body() data: RegistrationEmailDto) {
    const userAccount = await this.authQueryRepo.findByLoginOrEmail(data);

    if (!userAccount) {
      const command = new CreateTemporaryAccountCommand(data);

      return await this.commandBus.execute<
        CreateTemporaryAccountCommand,
        OutputId
      >(command);
    }

    const command = new PasswordRecoveryCommand(data);

    await this.commandBus.execute<PasswordRecoveryCommand, boolean>(command);
  }
  @ApiOperation({
    summary: 'Log out of the current device',
    description:
      'In cookie client must send correct refreshToken that will be revoked',
  })
  @ApiResponse({ status: 401 })
  @ApiResponse({ status: 204 })
  @UseGuards(RefreshTokenGuard)
  @Post(AuthNavigate.Logout)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@UserPayload() userInfo: UserSessionDto) {
    const command = new DeleteActiveSessionCommand(userInfo);
    await this.commandBus.execute(command);
  }

  @ApiOperation({
    summary: 'Get info about the current user',
    description: 'Get email, login and userId about the current user',
  })
  @ApiResponse({ status: 401 })
  @ApiResponse({ status: 200, type: UserInfoDto })
  @UseGuards(AccessTokenGuard)
  @Get(AuthNavigate.GetProfile)
  async getProfile(
    @UserPayload() userInfo: UserSessionDto,
  ): Promise<UserProfileType> {
    const user = await this.authQueryRepo.getUserById(userInfo.userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { email, login, id: userId } = user.accountData;

    return { email, login, userId };
  }
  @ApiOperation({
    summary: 'Generate new pair of access and refresh tokens',
    description:
      'Generate new pair of access and refresh tokens (in cookie client must send correct refreshToken that will be revoked after refreshing) Device LastActiveDate should be overrode by issued Date of new refresh token',
  })
  @ApiResponse({ status: 401 })
  @ApiResponse({
    status: 200,
    description:
      'Returns JWT accessToken (expired after 10 seconds) in body and JWT refreshToken in cookie (http-only, secure) (expired after 20 seconds).',
  })
  //@RefreshTokenEndpoint()
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Post(AuthNavigate.RefreshToken)
  async refreshToken(
    @UserPayload() userInfo: UserSessionDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { userId, deviceId } = userInfo;

    const { accessToken, refreshToken } =
      await this.authService.updateUserTokens(userId, deviceId);

    const userInfoAfterRefresh =
      this.authService.getUserPayloadByToken(refreshToken);

    const issuedAt = new Date(userInfoAfterRefresh!.iat * 1000);
    const expirationDate = new Date(userInfoAfterRefresh!.exp * 1000);

    const command = new UpdateIssuedTokenCommand({
      deviceId,
      issuedAt,
      expirationDate,
    });
    await this.commandBus.execute(command);

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
    return { accessToken };
  }
  @ApiOperation({
    summary: 'Confirm password recovery',
    description: 'Confirm password recovery and set a new password',
  })
  @ApiResponse({
    status: 400,
    description:
      'If the inputModel has incorrect value (for incorrect password length) or RecoveryCode is incorrect or expired',
  })
  @ApiBody({ type: RecoveryPassDto })
  @ApiResponse({
    status: 204,
    description: 'If code is valid and new password is accepted',
  })
  @ApiResponse({
    status: 429,
    description: 'More than 20 attempts from one IP-address during 20 seconds',
  })
  @UseGuards(CustomThrottlerGuard, CaptureGuard)
  @Post(AuthNavigate.NewPassword)
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmPasswordRecovery(@Body() body: RecoveryPassDto) {
    const existingAccount =
      await this.authQueryRepo.findUserAccountByRecoveryCode(body.recoveryCode);

    if (existingAccount) {
      const command = new UpdatePasswordCommand(body);

      return this.commandBus.execute<UpdatePasswordCommand, boolean>(command);
    }

    const command = new UpdatePassTempAccountCommand(body);

    return this.commandBus.execute(command);
  }

  @ApiOperation({
    summary: 'Confirm registration',
    description:
      'Confirm your registration with the code that was sent to your email by registration',
  })
  @ApiResponse({
    status: 400,
    description:
      'If the confirmation code is incorrect, expired or already been applied',
    type: ErrorMessageDto,
  })
  @ApiBody({ type: RegistrationCodeDto })
  @ApiResponse({
    status: 204,
    description: 'Email was verified. Account was activated',
  })
  @ApiResponse({
    status: 429,
    description: 'More than 20 attempts from one IP-address during 20 seconds',
  })
  @UseGuards(CustomThrottlerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post(AuthNavigate.RegistrationConfirmation)
  async registrationConfirmation(
    @Body() data: RegistrationCodeDto,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Res({ passthrough: true }) res: Response,
  ) {
    const command = new ConfirmEmailCommand(data);

    const confirmedUser = await this.commandBus.execute<
      ConfirmEmailCommand,
      boolean
    >(command);

    // if (!confirmedUser) {
    //   const errors = makeErrorsMessages('code');
    //   res.status(HttpStatus.BAD_REQUEST).send(errors);
    // }
  }
  @ApiOperation({
    summary: 'Resend confirmation registration email if user exist',
    description:
      'Send a new code to the email to confirm registration if the user exists',
  })
  @ApiResponse({
    status: 400,
    description: 'If the inputModel has incorrect values',
    type: ErrorMessageDto,
  })
  @ApiBody({ type: RegistrationCodeDto })
  @ApiResponse({
    status: 204,
    description:
      'Input data is accepted.Email with confirmation code will be send to passed email address.Confirmation code should be inside link as query param, for example: https://some-front.com/confirm-registration?code=youtcodehere',
  })
  @ApiResponse({
    status: 429,
    description: 'More than 20 attempts from one IP-address during 20 seconds',
  })
  @UseGuards(CustomThrottlerGuard)
  @Post(AuthNavigate.RegistrationEmailResending)
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationEmailResending(
    @Body() data: RegistrationEmailDto,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Res({ passthrough: true }) res: Response,
  ) {
    const userAccount = await this.authQueryRepo.findByLoginOrEmail(data);

    // if (
    //   !userAccount ||
    //   userAccount.emailConfirmation.isConfirmed ||
    //   new Date(userAccount.emailConfirmation.expirationDate) < new Date()
    // ) {
    //   const errors = makeErrorsMessages('confirmation');
    //   res.status(HttpStatus.BAD_REQUEST).send(errors);
    //   return;
    // }

    const command = new UpdateConfirmationCodeCommand(data);

    await this.commandBus.execute(command);
  }
}
