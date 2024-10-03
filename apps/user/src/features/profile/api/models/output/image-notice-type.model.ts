import { ImageStatus } from '@prisma/client';

export type ResponseProfileImageType = {
  status: ImageStatus;
  profileId: string;
};
