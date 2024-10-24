import { Injectable } from '@nestjs/common';
import { EmailAdapter } from '../adapters/email.adapter';

@Injectable()
export class EmailManager {
  private from: string;
  constructor(private emailAdapter: EmailAdapter) {
    this.from = `Networking platform👻 <netchill.ru>`;
  }

  async sendEmailMembershipSuccess(
    userEmail: string,
    userLogin: string,
  ): Promise<void> {
    const notificationData = {
      from: this.from,
      subject: 'Membership purchase',
      message: `,
      <p>Thanks ${userLogin} for purchase subscription</p>`,
      to: userEmail,
    };

    return this.emailAdapter.sendEmail(notificationData);
  }

  async sendEmailRecoveryMessage(
    email: string,
    recoveryCode: string,
  ): Promise<string> {
    const recoveryLink = `https://netchill.ru/reset-password?recoveryCode=${recoveryCode}`;

    const passwordRecoveryData = {
      from: this.from,
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
    confirmationCode: string,
  ): Promise<string> {
    const confirmationLink = `https://netchill.ru/confirm-email?code=${confirmationCode}`;
    const confirmationData = {
      from: this.from,
      subject: 'Email Confirmation',
      message: `<h1>Thank for your registration</h1>
                <p>To finish registration please follow the link below:
                    <a href=${confirmationLink}>complete registration</a>
                </p>`,
      to: email,
    };

    return this.emailAdapter.sendEmail(confirmationData);
  }

  async sendEmailRegistrationSuccess(email: string, userName: string) {
    const mailOptions = {
      from: this.from,
      to: email,
      subject: 'Registration Successful',
      message: `<h1>Thank you for registering, ${userName}!</h1>
             <p>We are excited to have you on board. If you have any questions, feel free to reach out to us.</p>`,
    };
    return this.emailAdapter.sendEmail(mailOptions);
  }
}
