import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { RmqService } from '@app/shared';

import { SubsQueryRepo } from '../../api/subs.query.repo';
import { SubscribeCommand } from '../use-cases/subscription.use-case';
import { UnsubscribeCommand } from '../use-cases/unsubscription.use-case';
import { BaseEventsApiService } from '@file/core/api/services/base-events-api.service';

@Injectable()
export class SubsApiService extends BaseEventsApiService<
  SubscribeCommand,
  UnsubscribeCommand | any
> {
  constructor(
    rmqService: RmqService,
    commandBus: CommandBus,
    queryRepo: SubsQueryRepo,
  ) {
    super(rmqService, commandBus, queryRepo);
  }
}
