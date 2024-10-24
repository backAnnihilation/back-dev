import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StrategyType } from './strategies.enum';

@Injectable()
export class LocalAuthGuard extends AuthGuard(StrategyType.Local) {}
