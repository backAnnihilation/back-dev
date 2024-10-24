import { ImageStatus } from '@prisma/client';

export type ResponseProfileImageType = {
  status: ImageStatus;
  imageId: string;
  profileId?: string;
};
