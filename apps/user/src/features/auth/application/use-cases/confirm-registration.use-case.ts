import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  LayerNoticeInterceptor
} from '../../../../../core/utils/notification';
import { AuthRepository } from '../../infrastructure/auth.repository';
import { UserService, userValidationOptions } from '../user.service';
import { ConfirmEmailCommand } from './commands/confirm-email.command';

@CommandHandler(ConfirmEmailCommand)
export class ConfirmRegistrationUseCase
  implements ICommandHandler<ConfirmEmailCommand>
{
  private location = this.constructor.name;
  constructor(
    private authRepo: AuthRepository,
    private userService: UserService,
  ) {}

  async execute(
    command: ConfirmEmailCommand,
  ): Promise<LayerNoticeInterceptor<boolean>> {
    const notice = new LayerNoticeInterceptor<boolean>();
    const { code } = command.confirmDto;

    const userAccount =
      await this.authRepo.findUserAccountByConfirmationCode(code);

    const validateNotification = this.userService.validateUserAccount({
      userAccount,
      ...userValidationOptions,
    });

    if (validateNotification.hasError) return validateNotification;

    const result = await this.authRepo.updateConfirmation(userAccount.id);
    notice.addData(!!result);
    return notice;
  }
}
