import { LayerNoticeInterceptor } from '@app/shared';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { OutboxRepository } from '../../infrastructure/events.outbox.repository';

export class ProfileImageDeliveryApprovedCommand {
  constructor(public eventId: string) {}
}

@CommandHandler(ProfileImageDeliveryApprovedCommand)
export class ProfileImageDeliveryApprovedUseCase
  implements ICommandHandler<ProfileImageDeliveryApprovedCommand>
{
  private location = this.constructor.name;
  constructor(private outboxRepo: OutboxRepository) {}

  async execute(
    command: ProfileImageDeliveryApprovedCommand,
  ): Promise<LayerNoticeInterceptor> {
    const notice = new LayerNoticeInterceptor();

    const event = await this.outboxRepo.getById(command.eventId);
    if (!event) {
      notice.addError(
        'Event not found',
        this.location,
        notice.errorCodes.ResourceNotFound,
      );
      return notice;
    }
    event.approveDelivery();

    await this.outboxRepo.save(event);

    return notice;
  }
}
