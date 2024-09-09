import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SecurityRepository } from '../../infrastructure/security.repository';
import { DeleteActiveSessionCommand } from './commands/delete-active-session.command';
import { LayerNoticeInterceptor } from '../../../../../../../libs/shared/notification';

@CommandHandler(DeleteActiveSessionCommand)
export class DeleteActiveSessionUseCase
  implements ICommandHandler<DeleteActiveSessionCommand>
{
  private location = this.constructor.name;

  constructor(private securityRepo: SecurityRepository) {}

  async execute(
    command: DeleteActiveSessionCommand,
  ): Promise<LayerNoticeInterceptor> {
    const notice = new LayerNoticeInterceptor();
    const { deviceId } = command.deleteData;
    await this.securityRepo.deleteSession(deviceId);
    return notice;
  }
}
