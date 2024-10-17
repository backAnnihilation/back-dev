import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { StrategyType } from '../../../../core/infrastructure/guards/models/strategy.enum';

@Injectable()
export class GoogleOauthGuard extends AuthGuard(StrategyType.Google) {
  constructor() {
    super({
      accessType: 'offline',
    });
  }
}
