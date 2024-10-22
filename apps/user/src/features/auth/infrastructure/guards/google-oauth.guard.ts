import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { StrategyType } from './strategies.enum';

@Injectable()
export class GoogleOauthGuard extends AuthGuard(StrategyType.Google) {
  constructor() {
    super({
      accessType: 'offline',
    });
  }
}
