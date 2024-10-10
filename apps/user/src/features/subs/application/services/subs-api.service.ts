import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { BaseCUDApiService } from '@app/shared';

import { SubsQueryRepo } from '../../api/subs.query.repository';
import { SubscribeCommand } from '../use-cases/subscription.use-case';
import { UnsubscribeCommand } from '../use-cases/unsubscription.use-case';
import { SubViewModel } from '../../api/models/output-models/view-sub.model';

@Injectable()
export class SubsCudApiService extends BaseCUDApiService<
  SubscribeCommand | UnsubscribeCommand,
  SubViewModel
> {
  constructor(commandBus: CommandBus, queryRepo: SubsQueryRepo) {
    super(commandBus, queryRepo);
  }
}
