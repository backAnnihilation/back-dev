import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { AuthRepository } from '../../infrastructure/auth.repository';
import { createRecoveryCode } from '../helpers/create-recovery-message.helper';
import { PasswordRecoveryCommand } from './commands/password-recovery.command';
import { SendRecoveryMessageEvent } from './send-recovery-msg.event';
import {
  LayerNoticeInterceptor,
  GetErrors,
} from '../../../../../../../libs/shared/notification';

@CommandHandler(PasswordRecoveryCommand)
export class PasswordRecoveryUseCase
  implements ICommandHandler<PasswordRecoveryCommand>
{
  private location = this.constructor.name;
  constructor(
    private eventBus: EventBus,
    private authRepo: AuthRepository,
  ) {}

  async execute(
    command: PasswordRecoveryCommand,
  ): Promise<LayerNoticeInterceptor> {
    const { email } = command.recoveryDto;
    const notice = new LayerNoticeInterceptor();
    const recoveryPassInfo = createRecoveryCode();
    const userAccount = await this.authRepo.findUserByEmail(email);
    if (!userAccount) {
      notice.addError(
        `User with this email ${email} doesn't exist`,
        this.location,
        GetErrors.NotFound,
      );
      return notice;
    }
    await this.authRepo.updateRecoveryCode(email, recoveryPassInfo);

    const event = new SendRecoveryMessageEvent({
      email,
      recoveryCode: recoveryPassInfo.recoveryCode,
    });
    this.eventBus.publish(event);

    return notice;
  }
}
