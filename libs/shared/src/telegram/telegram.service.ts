import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import * as Telegraph from 'telegraph-node';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '@user/core';
import { tgChatIds } from '../../../../apps/user/src/features/telegram/infrastructure/utils/chatIds';
import { EVENT_TYPES, REQUEST_MESSAGES, RESPONSE_MESSAGES } from './tg-events';

@Injectable()
export class TelegramService implements OnModuleInit {
  private bot: TelegramBot;
  private telegraphClient: Telegraph;
  private botToken: string;
  private logger = new Logger(TelegramService.name);
  constructor(private configService: ConfigService<EnvironmentVariables>) {
    this.telegraphClient = new Telegraph();
    this.botToken = this.configService.get('TELEGRAM_BOT_TOKEN');
  }

  onModuleInit(): void {
    this.initializeBot();
  }

  private initializeBot(): void {
    this.bot = new TelegramBot(this.botToken, { polling: true });

    this.setupMessageHandlers();
  }

  private handleCommand(command: string, chatId: number): void {
    switch (command) {
      case REQUEST_MESSAGES.COMMAND_START:
        return void this.handleStartCommand(chatId);
      case REQUEST_MESSAGES.COMMAND_STATISTIC:
        // this.handleStatisticCommand(chatId);
        break;
      default:
        return void this.sendMessageToUser(chatId, RESPONSE_MESSAGES.UNKNOWN);
    }
  }

  private handleStartCommand(chatId: number): void {
    const message = 'Hello bebra';
    this.sendMessageToUser(chatId, message);
  }

  private setupMessageHandlers(): void {
    this.bot.on(EVENT_TYPES.MESSAGE, (msg: TelegramBot.Message): void => {
      const chatId = msg.chat.id;
      const text = msg.text || '';

      if (text.startsWith('/')) {
        this.handleCommand(text, chatId);
      }

      this.logger.log(chatId, msg.text);
    });
  }

  async sendMessageToMultipleUsers(message: string): Promise<void> {
    const chatIds: number[] = [tgChatIds.tony, tgChatIds.ik];
    const sendPromises = chatIds.map((chatId: number) =>
      this.sendMessageToUser(chatId, message),
    );
    await Promise.all(sendPromises);
  }

  async sendMessageToUser(chatId: number, message: string): Promise<void> {
    try {
      await this.bot.sendMessage(chatId, message);
      this.logger.log(chatId, message);
    } catch (error) {
      this.logger.error(chatId, error);
    }
  }
}
