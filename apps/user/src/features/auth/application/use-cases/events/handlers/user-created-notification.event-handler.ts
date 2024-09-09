import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EmailManager } from '../../../../../../../core/managers/email-manager';
import { EmailNotificationEvent } from '../email-notification-event';

@EventsHandler(EmailNotificationEvent)
export class UserCreatedNoticeEventHandler
  implements IEventHandler<EmailNotificationEvent>
{
  constructor(private emailManager: EmailManager) {}
  async handle(event: EmailNotificationEvent) {
    this.emailManager.sendEmailConfirmationMessage(
      event.email,
      event.confirmationCode,
    );
  }
}
