import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { StrategyType } from './strategies.enum';

@Injectable()
export class GithubOauthGuard extends AuthGuard(StrategyType.Github) {}
