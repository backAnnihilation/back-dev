import { Module } from '@nestjs/common';

import { TelegramService } from './application/services/telegram.service';
import { TelegramLoggerService } from './application/services/logger-tg.service';
import { TelegramController } from './api/controllers/telegram.controller';

@Module({
  providers: [TelegramService, TelegramLoggerService],
  controllers: [TelegramController],
  exports: [TelegramService],
})
export class TelegramModule {}
