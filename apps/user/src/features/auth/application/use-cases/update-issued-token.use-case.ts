import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SecurityRepository } from '../../../security/infrastructure/security.repository';
import { UpdateIssuedTokenCommand } from './commands/update-Issued-token.command';
import { AuthService } from '../auth.service';
import { LayerNoticeInterceptor } from '../../../../../core/utils/notification';
import { JwtTokens } from '../../api/models/auth-input.models.ts/jwt.types';

@CommandHandler(UpdateIssuedTokenCommand)
export class UpdateIssuedTokenUseCase
  implements ICommandHandler<UpdateIssuedTokenCommand>
{
  constructor(
    private securityRepo: SecurityRepository,
    private authService: AuthService,
  ) {}

  async execute(
    command: UpdateIssuedTokenCommand,
  ): Promise<LayerNoticeInterceptor<JwtTokens>> {
    const notice = new LayerNoticeInterceptor<JwtTokens>();
    const { userId, deviceId } = command.updateData;
    const { accessToken, refreshToken } =
      await this.authService.updateUserTokens(userId, deviceId);

    const userInfoAfterRefresh =
      this.authService.getUserPayloadByToken(refreshToken);

    const issuedAt = new Date(userInfoAfterRefresh!.iat * 1000);
    const expirationDate = new Date(userInfoAfterRefresh!.exp * 1000);

    await this.securityRepo.updateIssuedToken(
      deviceId,
      issuedAt,
      expirationDate,
    );
    notice.addData({ accessToken, refreshToken });
    return notice;
  }
}
