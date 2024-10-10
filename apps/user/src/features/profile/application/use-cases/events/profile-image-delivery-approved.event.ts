import { Transport } from '@nestjs/microservices';
import { TransportManager } from '@user/core';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EVENT_COMMANDS, IMAGES_DELIVERED } from '@app/shared';

export class ProfileImageDeliveryApprovedEvent {
  constructor(public eventId: string) {}
}
@EventsHandler(ProfileImageDeliveryApprovedEvent)
export class ProfileImageDeliveryApprovedEventHandler
  implements IEventHandler<ProfileImageDeliveryApprovedEvent>
{
  constructor(private transportManager: TransportManager) {}
  async handle(event: ProfileImageDeliveryApprovedEvent): Promise<void> {
    const transport = Transport.RMQ;
    const command = IMAGES_DELIVERED;
    console.log('ProfileImageDeliveryApprovedEventHandler', { command, event });

    await this.transportManager.sendMessage(transport, command, event);
  }
}
