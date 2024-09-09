import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EmailManager } from '../../../../../../../core/managers/email-manager';
import { EmailNotificationOauthEvent } from '../email-notification-oauth-event';

@EventsHandler(EmailNotificationOauthEvent)
export class EmailNotificationOauthEventHandler
  implements IEventHandler<EmailNotificationOauthEvent>
{
  constructor(private emailManager: EmailManager) {}
  async handle(event: EmailNotificationOauthEvent) {
    await this.emailManager.sendEmailRegistrationSuccess(
      event.email,
      event.userName,
    );
  }
}
