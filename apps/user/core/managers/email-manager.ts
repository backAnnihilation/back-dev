import { Injectable } from '@nestjs/common';
import { EmailAdapter } from '../adapters/email.adapter';

@Injectable()
export class EmailManager {
  constructor(private emailAdapter: EmailAdapter) {}

  async sendEmailMembershipSuccess(
    userEmail: string,
    userLogin: string
  ): Promise<void> {
    const notificationData = {
      from: `Cringe Hub👻`,
      subject: 'Membership purchase',
      message: `,
      <p>Thanks ${userLogin} for purchase subscription</p>`,
      to: userEmail,
    };

    return this.emailAdapter.sendEmail(notificationData);
  }

  async sendEmailRecoveryMessage(
    email: string,
    recoveryCode: string
  ): Promise<string> {
    const recoveryLink = `https://Incta.team/password-recovery?recoveryCode=${recoveryCode}`;

    const passwordRecoveryData = {
      from: `Cringe Hub👻`,
      subject: 'Password recovery',
      message: `
                <p>To finish password recovery please follow the link below:
                <a href='${recoveryLink}'>recovery password</a>
                </p>
              `,
      to: email,
    };

    return this.emailAdapter.sendEmail(passwordRecoveryData);
  }

  async sendEmailConfirmationMessage(
    email: string,
    confirmationCode: string
  ): Promise<string> {
    const confirmationLink = `https://Incta.team/confirm-email?code=${confirmationCode}`;
    const confirmationData = {
      from: `Incta team👻`,
      subject: 'Email Confirmation',
      message: `<h1>Thank for your registration</h1>
                <p>To finish registration please follow the link below:
                    <a href=${confirmationLink}>complete registration</a>
                </p>`,
      to: email,
    };
    console.log({ confirmationData });

    return this.emailAdapter.sendEmail(confirmationData);
  }
}
