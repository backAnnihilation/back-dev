import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { StrategyType } from '../../../../core/infrastructure/guards/models/strategy.enum';

@Injectable()
export class RefreshTokenGuard extends AuthGuard(StrategyType.RefreshToken) {}
