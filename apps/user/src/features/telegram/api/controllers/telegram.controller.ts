import { Controller, Get } from '@nestjs/common';

import { TelegramService } from '../../application/services/telegram.service';
import { RESPONSE_MESSAGES } from '../../infrastructure/utils/events';

@Controller('tg')
export class TelegramController {
  constructor(private tgService: TelegramService) {}

  @Get()
  async bobr() {
    await this.tgService.sendMessageToMultipleUsers(
      RESPONSE_MESSAGES.ERROR_EVENT,
    );
  }
}
