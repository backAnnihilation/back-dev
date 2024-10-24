import { FileMetadata, ImageType, MediaType } from '@app/shared';

export type UploadFileDto = {
  image: FileMetadata;
  userId: string;
};

export type ProfileImageToSendType = {
  fileFormat: MediaType;
  image: FileMetadata;
  fileType: ImageType;
};

export type UploadProfileImageDto = {
  userId: string;
  image: FileMetadata;
};
