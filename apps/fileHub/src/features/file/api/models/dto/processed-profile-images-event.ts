import { EventType, BaseEvent } from '@app/shared';
import { OutboxDocument } from '../../../domain/entities/outbox.schema';

export class ProcessedProfileImagesEvent extends BaseEvent {
  payload: ProfileImagesPayloadType;
  constructor(eventDto: OutboxDocument) {
    super(eventDto.id, eventDto.eventType, eventDto.createdAt);
    this.payload = {
      profileId: eventDto.payload.profileId,
      imageId: eventDto.payload.imageId,
      urlOriginal: eventDto.payload.urlOriginal,
      urlSmall: eventDto.payload.urlSmall,
      urlLarge: eventDto.payload.urlLarge,
    };
  }
}

type ProfileImageUrls = {
  urlOriginal: string;
  urlSmall: string;
  urlLarge: string;
};

export type ProfileImageUrlsDtoType = ProfileImageUrls & {
  profileId: string;
  eventId: string;
  eventType: EventType;
};

type ProfileImagesPayloadType = ProfileImageUrls & {
  profileId: string;
  imageId: string;
};
