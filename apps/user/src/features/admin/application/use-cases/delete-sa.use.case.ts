import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.repo';
import { DeleteSACommand } from '../commands/delete-sa.command';
import {
  LayerNoticeInterceptor,
  GetErrors,
} from '../../../../../../../libs/shared/notification';

@CommandHandler(DeleteSACommand)
export class DeleteSAUseCase implements ICommandHandler<DeleteSACommand> {
  constructor(private usersRepo: UsersRepository) {}
  async execute(
    command: DeleteSACommand,
  ): Promise<LayerNoticeInterceptor<boolean>> {
    const notice = new LayerNoticeInterceptor<boolean>();

    const result = await this.usersRepo.deleteUser(command.userId);

    if (!result) {
      notice.addError(
        'User not found',
        this.constructor.name,
        GetErrors.NotFound,
      );
    }
    return notice;
  }
}
