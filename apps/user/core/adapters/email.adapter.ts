import { Injectable } from '@nestjs/common';
import { EnvironmentVariables } from '../config/configuration';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { SentMessageInfo } from 'nodemailer';

type EmailData = {
  from: string;
  subject: string;
  message: string;
  to: string;
};

@Injectable()
export class EmailAdapter {
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {}

  async sendEmail(sendEmailData: EmailData): Promise<SentMessageInfo | null> {
    const transporter = this.createTransport();

    try {
      const info: SentMessageInfo = await this.sendMail(
        transporter,
        sendEmailData,
      );

      return info.messageId;
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
    return nodemailer.createTransport({
      service: this.configService.get('EMAIL_SERVICE'),
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASSWORD'),
      },
    });
  }
}
