import { EVENT_COMMANDS, EventType } from '@app/shared';

export class BaseEvent {
  timestamp: Date;
  constructor(
    public eventId: string,
    public eventType: EventType | EVENT_COMMANDS,
  ) {
    this.timestamp = new Date();
  }
}
