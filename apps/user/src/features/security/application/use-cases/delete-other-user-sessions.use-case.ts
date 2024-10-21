import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { SecurityRepository } from '../../infrastructure/security.repository';
import { LayerNoticeInterceptor } from '../../../../../../../libs/shared/src/interceptors/notification';

import { DeleteOtherUserSessionsCommand } from './commands/delete-other-user-sessions.command';

@CommandHandler(DeleteOtherUserSessionsCommand)
export class DeleteOtherUserSessionsUseCase
  implements ICommandHandler<DeleteOtherUserSessionsCommand>
{
  constructor(private securityRepo: SecurityRepository) {}

  async execute(
    command: DeleteOtherUserSessionsCommand,
  ): Promise<LayerNoticeInterceptor> {
    const notice = new LayerNoticeInterceptor();
    await this.securityRepo.deleteOtherUserSessions(command.userSessionInfo);
    return notice;
  }
}
