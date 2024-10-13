import { Injectable, OnModuleInit } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import * as Telegraph from 'telegraph-node';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '@user/core';

import { tgChatIds } from '../../infrastructure/utils/chatIds';
import {
  EVENT_TYPES, REQUEST_MESSAGES,
  RESPONSE_MESSAGES,
} from '../../infrastructure/utils/events';

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
      case REQUEST_MESSAGES.COMMAND_START:
        this.handleStartCommand(chatId);
        break;
      case REQUEST_MESSAGES.COMMAND_STATISTIC:
        // this.handleStatisticCommand(chatId);
        break;
      default:
        this.sendMessageToUser(chatId, RESPONSE_MESSAGES.UNKNOWN);
        break;
    }
  }

  private handleStartCommand(chatId: number): void {
    const message = 'Hello bobr';
    this.sendMessageToUser(chatId, message);
  }

  private setupMessageHandlers(): void {
    this.bot.on(EVENT_TYPES.MESSAGE, (msg: TelegramBot.Message): void => {
      const chatId = msg.chat.id;
      const text = msg.text || '';

      if (text.startsWith('/')) {
        this.handleCommand(text, chatId);
      }

      this.logger.message(chatId, msg.text);
    });
  }

  async sendMessageToMultipleUsers(message: string): Promise<void> {
    const chatIds: number[] = [tgChatIds.tony, tgChatIds.ivan];
    for (const chatId of chatIds) {
      await this.sendMessageToUser(chatId, message);
    }
  }

  async sendMessageToUser(chatId: number, message: string): Promise<void> {
    try {
      await this.bot.sendMessage(chatId, message);
      this.logger.messageSent(chatId);
    } catch (error) {
      this.logger.error(chatId, error);
    }
  }
}
