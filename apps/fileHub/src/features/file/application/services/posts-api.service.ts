import { CommandBus } from '@nestjs/cqrs';
import { IPostImageViewModelType, RmqService } from '@app/shared';
import { BaseEventsApiService } from '@file/core/api/services/base-events-api.service';
import { PostsQueryRepository } from '../../api/post-image.query.repository';
import { UploadPostImageCommand } from '../use-cases/upload-post-image.use-case';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostsApiService extends BaseEventsApiService<
  UploadPostImageCommand,
  IPostImageViewModelType
> {
  constructor(
    rmqService: RmqService,
    commandBus: CommandBus,
    queryRepo: PostsQueryRepository,
  ) {
    super(rmqService, commandBus, queryRepo);
  }
}
