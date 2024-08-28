import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { AuthRepository } from '../../infrastructure/auth.repository';
import { UpdateConfirmationCodeCommand } from './commands/update-confirmation-code.command';
import { EmailNotificationEvent } from './events/email-notification-event';
import { createRecoveryCode } from '../helpers/create-recovery-message.helper';
import { UserService } from '../user.service';
import { LayerNoticeInterceptor } from '../../../../../core/utils/notification';

@CommandHandler(UpdateConfirmationCodeCommand)
export class UpdateConfirmationCodeUseCase
  implements ICommandHandler<UpdateConfirmationCodeCommand>
{
  constructor(
    private authRepo: AuthRepository,
    private eventBus: EventBus,
    private userService: UserService
  ) {}

  async execute(
    command: UpdateConfirmationCodeCommand
  ): Promise<LayerNoticeInterceptor<boolean>> {
    const { expirationDate, recoveryCode } = createRecoveryCode();
    const { email } = command.updateDto;
    const notice = new LayerNoticeInterceptor<boolean>();

    const userAccount = await this.authRepo.findUserByEmail(email);

    const validateNotification = this.userService.validateUserAccount({
      userAccount,
      isExpired: false,
      isConfirmed: true,
    });

    if (validateNotification.hasError) return validateNotification;

    const updatedCode = await this.authRepo.updateConfirmationCode({
      id: userAccount.id,
      recoveryCode,
      expirationDate,
    });

    const event = new EmailNotificationEvent(email, recoveryCode);
    this.eventBus.publish(event);

    notice.addData(updatedCode);
    return notice;
  }
}
