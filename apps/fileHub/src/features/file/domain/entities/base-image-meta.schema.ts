import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ImageCategory, ImageSize, LayerNoticeInterceptor } from '@app/shared';
import { HydratedDocument, Model } from 'mongoose';

export type BaseImageMetaDto = {
  name: string;
  url: string;
  size: number;
  category: ImageCategory;
  storageId: string;
  sizeType: ImageSize;
};

type TDocument<M extends BaseImageMeta> = HydratedDocument<M>;
export type BaseImageMetaDocument = TDocument<BaseImageMeta>;
export type BaseImageMetaModel = Model<BaseImageMetaDocument> &
  ImageMetaStatics;

@Schema({ timestamps: true })
export class BaseImageMeta {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  size: number;

  @Prop({ type: String, required: true })
  storageId: string;

  @Prop({ type: String, enum: ImageCategory, required: true })
  category: ImageCategory;

  @Prop({ type: String, enum: ImageSize, required: true })
  sizeType: ImageSize;

  createdAt: Date;
  updatedAt: Date;

  static async makeInstance<
    T extends BaseImageMetaDto,
    M extends BaseImageMeta,
  >(imageDto: T): Promise<LayerNoticeInterceptor<TDocument<M>>> {
    const notice = new LayerNoticeInterceptor<TDocument<M>>();
    const imageMeta = new this() as TDocument<M>;
    Object.assign(imageMeta, imageDto);

    await notice.validateFields(imageMeta);
    notice.addData(imageMeta);
    return notice;
  }
}

export const BaseImageMetaSchema = SchemaFactory.createForClass(BaseImageMeta);

const ImageMetaStatics = {
  makeInstance: BaseImageMeta.makeInstance,
};

export type ImageMetaStatics = typeof ImageMetaStatics;
BaseImageMetaSchema.statics = ImageMetaStatics;
