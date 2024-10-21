import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BcryptAdapter } from '@user/core/adapters/bcrypt.adapter';
import { SecurityRepository } from '../../../security/infrastructure/security.repository';
import { AuthRepository } from '../../infrastructure/auth.repository';
import { LayerNoticeInterceptor } from '@app/shared';
import { UpdatePasswordCommand } from './commands/update-password.command';

@CommandHandler(UpdatePasswordCommand)
export class UpdatePasswordUseCase
  implements ICommandHandler<UpdatePasswordCommand>
{
  private location = this.constructor.name;
  constructor(
    private authRepo: AuthRepository,
    private bcryptAdapter: BcryptAdapter,
    private securityRepo: SecurityRepository,
  ) {}

  async execute(
    command: UpdatePasswordCommand,
  ): Promise<LayerNoticeInterceptor> {
    const notice = new LayerNoticeInterceptor();
    const { recoveryCode, newPassword } = command.updateDto;

    const { passwordHash } = await this.bcryptAdapter.createHash(newPassword);

    const userAccount =
      await this.authRepo.findUserByRecoveryCode(recoveryCode);

    if (!userAccount) {
      notice.addError(
        'User not found due to an incorrect or expired code',
        this.location,
        notice.errorCodes.ValidationError,
      );
      return notice;
    }

    await this.authRepo.updatePassword({
      userId: userAccount.id,
      passwordHash,
    });

    await this.securityRepo.deleteActiveSessions(userAccount.id);

    return notice;
  }
}
