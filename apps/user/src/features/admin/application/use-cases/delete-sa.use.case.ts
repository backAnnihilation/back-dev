import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LayerNoticeInterceptor } from '@app/shared';
import { UsersRepository } from '../../infrastructure/users.repository';
import { DeleteSACommand } from '../commands/delete-sa.command';

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
        notice.errorCodes.ResourceNotFound,
      );
    }
    return notice;
  }
}
