import { Injectable } from '@nestjs/common';

@Injectable()
export class TelegramLoggerService {
  message(chatId: number, text: string | undefined | null): void {
    console.log(`Received message from user with ID: ${chatId}, text: ${text}`);
  }

  error(chatId: number, error: any): void {
    console.error(`Error sending message to user with ID: ${chatId}:`, error);
  }

  messageSent(chatId: number, text: string | undefined | null): void {
    console.log(`Message sent to user with ID: ${chatId}, text: ${text}`);
  }
}
