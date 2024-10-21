import { ImageStatus } from '@prisma/client';
import { EVENT_COMMANDS } from '@app/shared';

export type UpdateProfileImageType = {
  status: ImageStatus;
  urlOriginal: string;
  urlSmall: string;
  urlLarge: string;
  imageMetaId: string;
};

export type ImageDtoType = ImageUrlsType & {
  eventId: string;
  eventType: EVENT_COMMANDS;
  timestamp: Date;
  payload: ImageUrlsType & {
    imageId: string;
    profileId: string;
    imageMetaId: string;
  };
};

type ImageUrlsType = {
  urlOriginal: string;
  urlSmall: string;
  urlLarge: string;
};
