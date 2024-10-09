import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { BaseCUDApiService, RmqService } from '@app/shared';
import { BaseEventsApiService } from '@file/core/api/services/base-events-api.service';

import { SubsQueryRepo } from '../../api/subs.query.repo';
import { SubscribeCommand } from '../use-cases/subscription.use-case';
import { UnsubscribeCommand } from '../use-cases/unsubscription.use-case';
import { UserSubscription } from '../../domain/entities/subs.table';
import { EditPostCommand } from '../../../post/application/use-cases/edit-post.use-case';
import { DeletePostCommand } from '../../../post/application/use-cases/delete-post.use-case';
import { CreatePostCommand } from '../../../post/application/use-cases/create-post.use-case';
import { PostViewModel } from '../../../post/api/models/output/post.view.model';
import { PostQueryRepository } from '../../../post/api/query-repositories/post.query.repository';

@Injectable()
export class SubsCudApiService extends BaseCUDApiService<
  SubscribeCommand | UnsubscribeCommand,
  UserSubscription
> {
  constructor(commandBus: CommandBus, queryRepo: SubsQueryRepo) {
    super(commandBus, queryRepo);
  }
}
