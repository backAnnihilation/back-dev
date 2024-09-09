import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { UsersQueryRepo } from '../api/query-repositories/user-account.query.repo';
import {
  BaseCUDApiService,
  BaseViewModel,
} from '../../../../core/api/services/base-cud-api.service';

@Injectable()
export class BloggerCrudApiService<TCommand> extends BaseCUDApiService<
  TCommand,
  BaseViewModel
> {
  constructor(commandBus: CommandBus, usersQueryRepo: UsersQueryRepo) {
    super(commandBus, usersQueryRepo);
  }
}
