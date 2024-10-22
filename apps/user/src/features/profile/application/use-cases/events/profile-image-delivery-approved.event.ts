import { IMAGES_DELIVERED } from '@app/shared';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Transport } from '@nestjs/microservices';
import { TransportManager } from '../../../../../core/managers/transport.manager';

export class ProfileImageDeliveryApprovedEvent {
  constructor(public eventId: string) {}
}
@EventsHandler(ProfileImageDeliveryApprovedEvent)
export class ProfileImageDeliveryApprovedEventHandler
  implements IEventHandler<ProfileImageDeliveryApprovedEvent>
{
  constructor(private transportManager: TransportManager) {}
  async handle(event: ProfileImageDeliveryApprovedEvent): Promise<void> {
    console.log('ProfileImageDeliveryApprovedEventHandler', { event });

    await this.transportManager.sendMessage({
      transport: Transport.RMQ,
      command: IMAGES_DELIVERED,
      payload: event,
    });
  }
}
