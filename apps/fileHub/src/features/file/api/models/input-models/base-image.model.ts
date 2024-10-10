import { IsEnum, IsObject } from 'class-validator';
import { FileMetadata, ImageType, MediaType } from '@app/shared';

export class BaseImageDto {
  @IsEnum(ImageType)
  imageType: ImageType;
  @IsEnum(MediaType)
  imageFormat: MediaType;
  @IsObject()
  image: FileMetadata;
}
