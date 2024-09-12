import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PostsController } from './api/post.controller';
import { PostQueryRepo } from './api/query-repositories/post.query.repo';
import { UserPostApiService } from './application/services/post-api.service';
import { EditPostUseCase } from './application/use-cases/edit-post.use-case';
import { PostsRepository } from './infrastructure/posts.repo';

@Module({
  imports: [CqrsModule],
  controllers: [PostsController],
  providers: [PostQueryRepo, UserPostApiService, PostsRepository],
})
export class PostModule {}
