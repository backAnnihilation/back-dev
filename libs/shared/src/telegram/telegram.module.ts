import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegramLoggerService } from '../../../../apps/user/src/features/telegram/application/services/logger-tg.service';
import { TelegramController } from '../../../../apps/user/src/features/telegram/api/controllers/telegram.controller';

@Module({
  providers: [TelegramService, TelegramLoggerService],
  controllers: [TelegramController],
  exports: [TelegramService],
})
export class TelegramModule {}
