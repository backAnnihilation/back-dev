import { IsEnum, IsObject, IsOptional, IsString } from 'class-validator';
import { FileMetadata, ImageType, MediaType } from '@app/shared';

export class BaseImageDto {
  @IsOptional()
  @IsEnum(ImageType)
  imageType?: ImageType;

  @IsOptional()
  @IsEnum(MediaType)
  imageFormat?: MediaType;

  @IsObject()
  image: FileMetadata;

  @IsString()
  imageId: string;
}
