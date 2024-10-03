import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { RmqService } from '@app/shared';
import { BaseEventsApiService } from '@file/core/api/services/base-events-api.service';

import { SubsQueryRepo } from '../../api/subs.query.repo';
import { SubscribeCommand } from '../use-cases/subscription.use-case';
import { UnsubscribeCommand } from '../use-cases/unsubscription.use-case';
import { UserSubscription } from '../../domain/entities/subs.table';

@Injectable()
export class SubsApiService extends BaseEventsApiService<
  SubscribeCommand,
  UnsubscribeCommand | UserSubscription
> {
  constructor(
    rmqService: RmqService,
    commandBus: CommandBus,
    queryRepo: SubsQueryRepo,
  ) {
    super(rmqService, commandBus, queryRepo);
  }
}
