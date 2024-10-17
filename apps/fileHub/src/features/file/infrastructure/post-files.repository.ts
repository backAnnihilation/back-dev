import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { BaseRepository } from '@file/core/db/base.files.repository';
import { PostImageMeta, PostImageMetaDocument, PostImageMetaModel } from '../domain/entities/post-image-meta.schema';

@Injectable()
export class PostsRepository extends BaseRepository<PostImageMetaDocument> {
  constructor(@InjectModel(PostImageMeta.name) postFileModel: PostImageMetaModel) {
    super(postFileModel);
  }
}
