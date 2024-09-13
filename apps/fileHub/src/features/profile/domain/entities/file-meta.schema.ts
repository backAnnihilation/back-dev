import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { LayerNoticeInterceptor } from '@shared/notification';
import {
  FileFormat,
  ImageType,
} from '../../api/models/enums/file-details.enum';

export type FileMetaDocument = HydratedDocument<FileMeta>;
export type FileMetaModel = Model<FileMetaDocument> & FileMetaStatics;

export type CreateFileMetaDto = {
  fileName: string;
  fileUrl: string;
  fileId: string;
  fileSize: number;
  userId?: string;
  profileId: string;
  fileFormat: FileFormat;
  fileType: ImageType;
};

const FileDetails = {
  fileFormat: { type: String, enum: FileFormat, required: true },
  fileType: { type: String, enum: ImageType, required: true },
  resolution: { type: String, required: false },
  duration: { type: String, required: false },
};
type FileDetailsType = {
  fileFormat: FileFormat;
  fileType: ImageType;
};

@Schema({ timestamps: true })
export class FileMeta {
  @Prop({ required: true })
  fileName: string;

  @Prop({ required: true })
  fileUrl: string;

  @Prop({ _id: false, type: FileDetails })
  fileDetails: FileDetailsType;

  @Prop({ type: String, required: true })
  fileId: string;

  @Prop({ required: true })
  fileSize: number;

  @Prop({ required: true })
  profileId: string;

  createdAt: Date;
  updatedAt: Date;

  static async makeInstance(
    uploadFileDto: CreateFileMetaDto,
  ): Promise<LayerNoticeInterceptor<FileMetaDocument>> {
    const notice = new LayerNoticeInterceptor<FileMetaDocument>();
    const { fileFormat, fileType, ...mainFileDetails } = uploadFileDto;
    const fileMeta = new this() as FileMetaDocument;
    Object.assign(fileMeta, mainFileDetails);
    fileMeta.fileDetails = { fileFormat, fileType };

    await notice.validateFields(fileMeta);
    notice.addData(fileMeta);
    return notice;
  }
}
export const FileMetaSchema = SchemaFactory.createForClass(FileMeta);
export const FileMetaStatics = {
  makeInstance: FileMeta.makeInstance,
};
type FileMetaStatics = typeof FileMetaStatics;
FileMetaSchema.statics = FileMetaStatics;
