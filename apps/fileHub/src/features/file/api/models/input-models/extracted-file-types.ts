import { ContentType } from '../output-models/file-output-types';

export type FileExtractedType = {
  buffer: Buffer;
  originalname: string;
  mimetype: ContentType;
  size: number;
};

// export type FileFormatType = {
//   fileFormat: FileFormat;
//   fileType: ImageType;
//   profileId: string;
// };

export class InputFileTypesDto {
  // @IsEnum(FileFormat)
  // fileFormat: FileFormat;
  // @IsEnum(ImageType)
  // fileType: ImageType;
}
