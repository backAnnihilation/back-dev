import { EventType } from '@app/shared';

export class BaseEvent {
  timestamp: Date;
  constructor(
    public eventId: string,
    public eventType: EventType,
    createdAt?: Date,
  ) {
    this.timestamp = createdAt || new Date();
  }
}
