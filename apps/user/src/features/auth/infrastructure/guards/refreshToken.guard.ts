import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { StrategyType } from './strategies.enum';

@Injectable()
export class RefreshTokenGuard extends AuthGuard(StrategyType.RefreshToken) {}
