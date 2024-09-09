import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StrategyType } from '../../../../../core/infrastructure/guards/models/strategy.enum';

@Injectable()
export class AccessTokenGuard extends AuthGuard(StrategyType.AccessToken) {
  private readonly logger = new Logger(AccessTokenGuard.name);

  // handleRequest(err, user, info) {
  //   if (err || !user) {
  //     this.logger.error(
  //       `${err || 'user not found'}`,
  //     );
  //     this.logger.error(`${JSON.stringify(info)}`);
  //     throw err || new UnauthorizedException();
  //   }

  //   this.logger.log(`success: ${user.username}`);
  //   return user;
  // }
}
