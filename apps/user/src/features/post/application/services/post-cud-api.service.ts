import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { EditPostCommand } from '../use-cases/edit-post.use-case';
import { PostViewModel } from '../../api/models/output/post.view.model';
import { DeletePostCommand } from '../use-cases/delete-post.use-case';
import { CreatePostCommand } from '../use-cases/create-post.use-case';
import { PostQueryRepository } from '../../api/query-repositories/post.query.repository';
import { BaseCUDApiService } from '@app/shared';

@Injectable()
export class PostCudApiService extends BaseCUDApiService<
  EditPostCommand | DeletePostCommand | CreatePostCommand,
  PostViewModel
> {
  constructor(commandBus: CommandBus, queryRepo: PostQueryRepository) {
    super(commandBus, queryRepo);
  }
}
