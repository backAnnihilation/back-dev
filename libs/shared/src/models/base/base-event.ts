import { EVENT_COMMANDS, EventType } from '@app/shared';

export class BaseEvent {
  timestamp: Date;
  constructor(
    public eventId: string,
    public eventType: EventType | EVENT_COMMANDS,
    createdAt?: Date,
  ) {
    this.timestamp = createdAt || new Date();
  }
}
