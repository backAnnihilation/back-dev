import { Controller, Get } from '@nestjs/common';

import { TelegramService } from '../../../../../../../libs/shared/src/telegram/telegram.service';
import { RESPONSE_MESSAGES } from '../../../../../../../libs/shared/src/telegram/tg-events';

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
