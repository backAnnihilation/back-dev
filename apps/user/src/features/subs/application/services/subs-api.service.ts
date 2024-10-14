import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { BaseCUDApiService } from '@app/shared';
import { SubsQueryRepository } from '../../api/subs.query.repository';
import { SubscribeCommand } from '../use-cases/subscribe-to-user.use-case';
import { UnsubscribeCommand } from '../use-cases/unsubscription.use-case';
import { SubViewModel } from '../../api/models/output-models/view-sub.model';

@Injectable()
export class SubsCudApiService extends BaseCUDApiService<
  SubscribeCommand | UnsubscribeCommand,
  SubViewModel
> {
  constructor(commandBus: CommandBus, queryRepo: SubsQueryRepository) {
    super(commandBus, queryRepo);
  }
}
