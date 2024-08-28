import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.repo';
import { DeleteSACommand } from '../commands/delete-sa.command';
import {
  LayerNoticeInterceptor,
  GetErrors,
} from '../../../../../core/utils/notification';
import { DropDbSaCommand } from "../commands/drop-db-sa.command";
import { DropBbRepository } from "../../infrastructure/drop.repo";

@CommandHandler(DropDbSaCommand)
export class DropDbSaUseCase implements ICommandHandler<DropDbSaCommand> {
  constructor(private dbRepo: DropBbRepository) {}

  async execute(
    command: DropDbSaCommand,
  ): Promise<LayerNoticeInterceptor<any>> {
    const notice = new LayerNoticeInterceptor<any>();

    const result = await this.dbRepo.clearDatabase();

    notice.addData(result);

    return notice;
  }
}

