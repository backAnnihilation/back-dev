import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BcryptAdapter } from '../../../../../core/adapters/bcrypt.adapter';
import {
  GetErrors,
  LayerNoticeInterceptor,
} from '../../../../../core/utils/notification';
import { AuthRepository } from '../../infrastructure/auth.repository';
import { UpdatePasswordCommand } from './commands/update-password.command';

@CommandHandler(UpdatePasswordCommand)
export class UpdatePasswordUseCase
  implements ICommandHandler<UpdatePasswordCommand>
{
  private location = this.constructor.name;
  constructor(
    private authRepo: AuthRepository,
    private bcryptAdapter: BcryptAdapter
  ) {}

  async execute(
    command: UpdatePasswordCommand
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
        GetErrors.IncorrectModel
      );
      return notice;
    }

    await this.authRepo.updateUserPassword({
      userId: userAccount.id,
      passwordHash,
    });

    return notice;
  }
}
