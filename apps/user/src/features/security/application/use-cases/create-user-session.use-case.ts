import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserSessionDTO } from '../../../auth/api/models/dtos/user-session.dto';
import { SecurityRepository } from '../../infrastructure/security.repository';
import { CreateSessionCommand } from './commands/create-session.command';
import { AuthService } from '../../../auth/application/auth.service';
import { extractDeviceInfo } from '../../infrastructure/utils/device-info-extractor';
import { JwtTokens } from '../../../auth/api/models/auth-input.models.ts/jwt.types';
import { LayerNoticeInterceptor, GetErrors } from '../../../../../../../libs/shared/notification';

@CommandHandler(CreateSessionCommand)
export class CreateUserSessionUseCase
  implements ICommandHandler<CreateSessionCommand>
{
  private location = this.constructor.name;
  constructor(
    private securityRepo: SecurityRepository,
    private authService: AuthService,
  ) {}

  async execute(
    command: CreateSessionCommand,
  ): Promise<LayerNoticeInterceptor<JwtTokens>> {
    const notice = new LayerNoticeInterceptor<JwtTokens>();

    const { userId, clientInfo } = command.inputData;

    const { accessToken, refreshToken } =
      await this.authService.createTokenPair(userId);

    const userPayload = this.authService.getUserPayloadByToken(refreshToken);

    if (!userPayload) {
      notice.addError(
        `can't retrieve user payload from token`,
        this.location,
        GetErrors.DeniedAccess,
      );
      return notice;
    }

    let browser = 'unknown',
      deviceType = 'unknown';
    if (clientInfo) {
      const deviceInfo = extractDeviceInfo(clientInfo.userAgentInfo);
      browser = deviceInfo.browser;
      deviceType = deviceInfo.deviceType;
    }

    const sessionDto = new UserSessionDTO(
      clientInfo?.ip,
      `Device type: ${deviceType}, Application: ${browser}`,
      userPayload,
      refreshToken,
    );

    await this.securityRepo.createSession(sessionDto);

    notice.addData({ accessToken, refreshToken });
    return notice;
  }
}
