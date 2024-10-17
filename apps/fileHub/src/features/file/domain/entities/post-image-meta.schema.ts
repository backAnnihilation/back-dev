import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import {
  BaseImageMeta,
  BaseImageMetaDto,
  BaseImageMetaSchema,
} from './base-image-meta.schema';
import { LayerNoticeInterceptor } from '@app/shared';

export type PostImageMetaDocument = HydratedDocument<PostImageMeta>;
export type PostImageMetaModel = Model<PostImageMetaDocument> &
  PostImageStatics;
type PostImageDto = {
  imageId: string;
  postId: string;
  imagesMeta: BaseImageMeta[];
};

@Schema({ timestamps: true })
export class PostImageMeta {
  @Prop({ required: true })
  imageId: string;

  @Prop({ required: true })
  postId: string;

  @Prop({ type: [BaseImageMeta], required: false })
  imagesMeta: BaseImageMeta[];

  createdAt: Date;
  updatedAt: Date;

  static async makeInstance(dto: PostImageDto) {
    const notice = new LayerNoticeInterceptor<PostImageMetaDocument>();
    const imageMeta = new this() as PostImageMetaDocument;

    Object.assign(imageMeta, dto);
    await notice.validateFields(imageMeta);
    notice.addData(imageMeta);
    return notice;
  }

  updateImagesMeta(metaDto: BaseImageMeta[]) {
    this.imagesMeta.push(...metaDto);
  }
}

export const PostImageMetaSchema = SchemaFactory.createForClass(PostImageMeta);

const statics = {
  makeInstance: PostImageMeta.makeInstance,
};
type PostImageStatics = typeof statics;
PostImageMetaSchema.statics = statics;
