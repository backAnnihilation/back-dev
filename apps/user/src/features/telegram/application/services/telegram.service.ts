import { Injectable, OnModuleInit } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import * as Telegraph from 'telegraph-node';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '@user/core';

import { tgChatIds } from '../../infrastructure/utils/chatIds';
import { COMMAND_START, MESSAGE_EVENT } from '../../infrastructure/utils/events';

import { TelegramLoggerService } from './logger-tg.service';

@Injectable()
export class TelegramService implements OnModuleInit {
  private bot: TelegramBot;
  private telegraphClient: Telegraph;
  private botToken: string;

  constructor(
    private configService: ConfigService<EnvironmentVariables>,
    private logger: TelegramLoggerService,
  ) {
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
      case COMMAND_START:
        this.handleStartCommand(chatId);
        break;
      case '/statistic':
        // this.handleStatisticCommand(chatId);
        break;
      default:
        this.sendMessageToUser(chatId, 'Unknown command.');
        break;
    }
  }

  private handleStartCommand(chatId: number): void {
    const message = 'Hello bobr';
    this.sendMessageToUser(chatId, message);
  }

  private setupMessageHandlers(): void {
    this.bot.on(MESSAGE_EVENT, (msg: TelegramBot.Message): void => {
      const chatId = msg.chat.id;
      const text = msg.text || '';

      if (text.startsWith('/')) {
        this.handleCommand(text, chatId);
      }

      this.logger.message(chatId, msg.text);
    });
  }
  async sendMessageToUser(chatId: number, message: string): Promise<void> {
    try {
      await this.bot.sendMessage(chatId, message);
      this.logger.messageSent(chatId);
    } catch (error) {
      this.logger.error(chatId, error);
    }
  }

  async sendMessageToMultipleUsers(message: string): Promise<void> {
    const chatIds: number[] = [tgChatIds.tony];
    for (const chatId of chatIds) {
      await this.sendMessageToUser(chatId, message);
    }
  }
}
