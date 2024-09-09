import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { BaseCUDApiService } from '../../../../../core/api/services/base-cud-api.service';

import { PostQueryRepo } from '../../api/query-repositories/post.query.repo';
import { EditPostCommand } from '../use-cases/edit-post.use-case';
import { UserPostViewModel } from '../../api/models/output/post.view.model';
import { DeletePostCommand } from '../use-cases/delete-post.use-case';
import { CreatePostCommand } from '../use-cases/create-post.use-case';

@Injectable()
export class UserPostApiService extends BaseCUDApiService<
EditPostCommand | DeletePostCommand | CreatePostCommand,
UserPostViewModel
> {
  constructor(commandBus: CommandBus, queryRepo: PostQueryRepo) {
    super(commandBus, queryRepo);
  }
}
