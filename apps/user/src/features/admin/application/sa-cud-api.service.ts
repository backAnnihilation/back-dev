import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { SAViewType } from '../api/models/user.view.models/userAdmin.view-type';
import { UsersQueryRepo } from '../api/query-repositories/user-account.query.repo';
import { BaseCUDApiService } from '@app/shared';
import { CreateSACommand } from './commands/create-sa.command';
import { DeleteSACommand } from './commands/delete-sa.command';

@Injectable()
export class SACudApiService extends BaseCUDApiService<
  CreateSACommand | DeleteSACommand,
  SAViewType
> {
  constructor(commandBus: CommandBus, usersQueryRepo: UsersQueryRepo) {
    super(commandBus, usersQueryRepo);
  }
}
