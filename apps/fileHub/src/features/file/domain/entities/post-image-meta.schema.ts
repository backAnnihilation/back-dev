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

export type PostImageMetaDto = BaseImageMetaDto & {
  userId: string;
  postId: string;
};

@Schema({ timestamps: true })
export class PostImageMeta extends BaseImageMeta {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  postId: string;

  @Prop({ type: [BaseImageMetaSchema] })
  imagesMeta: BaseImageMeta[];

  createdAt: Date;
  updatedAt: Date;

  static async makeInstance(
    imageDto: Partial<PostImageMetaDocument> & Partial<BaseImageMeta>,
  ) {
    const notice = new LayerNoticeInterceptor<PostImageMetaDocument>();
    const imageMeta = new this() as PostImageMetaDocument;

    Object.assign(imageMeta, imageDto);
    await notice.validateFields(imageMeta);
    notice.addData(imageMeta);
    return notice;
  }
}

export const PostImageMetaSchema = SchemaFactory.createForClass(PostImageMeta);

const statics = {
  makeInstance: PostImageMeta.makeInstance,
};
type PostImageStatics = typeof statics;
PostImageMetaSchema.statics = statics;
