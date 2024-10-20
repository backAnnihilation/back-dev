import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { BaseImageMeta, BaseImageMetaDto } from './base-image-meta.schema';
import { LayerNoticeInterceptor } from '@app/shared';

export type ProfileImageDocument = HydratedDocument<ProfileImageMeta>;
export type ProfileImageModel = Model<ProfileImageDocument> &
  ProfileImageMetaStatics;

@Schema({ timestamps: true })
export class ProfileImageMeta {
  @Prop({ required: true, type: String })
  profileId: string;

  @Prop({ required: true, type: String })
  imageId: string;

  @Prop({ type: [BaseImageMeta], required: true })
  imagesMeta: BaseImageMeta[];

  createdAt: Date;
  updatedAt: Date;

  static async makeInstance(imageDto: Partial<ProfileImageMeta>) {
    const notice = new LayerNoticeInterceptor<ProfileImageDocument>();
    const imageMeta = new this() as ProfileImageDocument;

    Object.assign(imageMeta, imageDto);
    await notice.validateEntity(imageMeta);
    notice.addData(imageMeta);
    return notice;
  }
}

export const ProfileImageMetaSchema =
  SchemaFactory.createForClass(ProfileImageMeta);

const imageMetaStatics = {
  makeInstance: ProfileImageMeta.makeInstance,
};

ProfileImageMetaSchema.statics = imageMetaStatics;
type ProfileImageMetaStatics = typeof ProfileImageMeta;
