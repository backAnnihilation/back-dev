import { IPostImageViewModelType } from '@app/shared';
import { BaseFilesQueryRepository } from '@file/core/api/base-files-query-repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  PostImageMeta,
  PostImageMetaDocument,
  PostImageMetaModel,
} from '../domain/entities/post-image-meta.schema';

@Injectable()
export class PostsQueryRepository extends BaseFilesQueryRepository<
  PostImageMetaDocument,
  IPostImageViewModelType
> {
  constructor(
    @InjectModel(PostImageMeta.name) postImageModel: PostImageMetaModel,
  ) {
    super(postImageModel);
  }
}
