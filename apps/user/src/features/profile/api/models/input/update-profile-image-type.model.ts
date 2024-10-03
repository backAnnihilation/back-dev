import { ImageStatus } from '@prisma/client';
import { EVENT_COMMANDS } from '@app/shared';

export type UpdateProfileImageType = {
  status: ImageStatus;
  urls: ImageUrlsType;
};

export type ImageDtoType = ImageUrlsType & {
  eventId: string;
  eventType: EVENT_COMMANDS;
  timestamp: Date;
  payload: ImageUrlsType & { profileId: string };
};

type ImageUrlsType = {
  urlOriginal: string;
  urlSmall: string;
  urlLarge: string;
};
