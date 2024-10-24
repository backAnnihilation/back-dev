import { ImageStatus } from '@prisma/client';

export type ProfileImageProcessType = {
  profileId: string;
  status: ImageStatus;
};
