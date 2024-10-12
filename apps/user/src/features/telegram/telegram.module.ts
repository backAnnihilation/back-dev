import { Module } from '@nestjs/common';

import { TelegramService } from './application/services/telegram.service';
import { TelegramLoggerService } from './application/services/logger-tg.service';

@Module({
  providers: [TelegramService, TelegramLoggerService],
  controllers: [],
  exports: [TelegramService],
})
export class TelegramModule {}
