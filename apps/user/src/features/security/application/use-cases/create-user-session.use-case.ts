import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { OutputId } from '../../../../../core/api/dto/output-id.dto';
import {
  LayerNoticeInterceptor,
  GetErrors,
} from '../../../../../core/utils/notification';
import { UserSessionDTO } from '../../../auth/api/models/dtos/user-session.dto';
import { SecurityRepository } from '../../infrastructure/security.repository';
import { CreateSessionCommand } from './commands/create-session.command';
import { AuthService } from '../../../auth/application/auth.service';
import { extractDeviceInfo } from '../../../auth/infrastructure/utils/device-info-extractor';
import { JwtTokens } from '../../../auth/api/models/auth-input.models.ts/jwt.types';

@CommandHandler(CreateSessionCommand)
export class CreateUserSessionUseCase
  implements ICommandHandler<CreateSessionCommand>
{
  private location = this.constructor.name;
  constructor(
    private securityRepo: SecurityRepository,
    private authService: AuthService
  ) {}

  async execute(
    command: CreateSessionCommand
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
        GetErrors.DeniedAccess
      );
      return notice;
    }

    const { browser, deviceType } = extractDeviceInfo(clientInfo.userAgentInfo);

    const sessionDto = new UserSessionDTO(
      clientInfo.ip,
      `Device type: ${deviceType}, Application: ${browser}`,
      userPayload,
      refreshToken
    );

    await this.securityRepo.createSession(sessionDto);

    notice.addData({ accessToken, refreshToken });
    return notice;
  }
}
