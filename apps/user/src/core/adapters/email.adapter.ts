import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { SentMessageInfo } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { EnvironmentVariables } from '../config/configuration';

type EmailData = {
  from: string;
  subject: string;
  message: string;
  to: string;
};

@Injectable()
export class EmailAdapter {
  private readonly transport: SMTPTransport.Options;
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {
    this.transport = {
      service: this.configService.get('EMAIL_SERVICE'),
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASSWORD'),
      },
    };
  }

  async sendEmail(sendEmailData: EmailData): Promise<SentMessageInfo | null> {
    const transport = this.createTransport();

    try {
      const sentMessageInfo = await this.sendMail(transport, sendEmailData);
      return sentMessageInfo.messageId;
    } catch (error) {
      console.error(
        `Failed with ${sendEmailData.subject.toLowerCase()} message sending `,
        error,
      );
    }
  }

  private async sendMail(
    transporter: SentMessageInfo,
    sendEmailData: Omit<EmailData, 'emailSettings'>,
  ): Promise<SentMessageInfo> {
    return transporter.sendMail({
      from: sendEmailData.from,
      sender: `Testing`,
      to: sendEmailData.to,
      subject: sendEmailData.subject,
      html: sendEmailData.message,
    });
  }

  private createTransport() {
    return nodemailer.createTransport(this.transport);
  }
}
