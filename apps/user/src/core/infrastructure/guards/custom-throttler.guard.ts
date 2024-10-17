import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import {
  ThrottlerGenerateKeyFunction,
  ThrottlerGetTrackerFunction,
  ThrottlerGuard,
  ThrottlerOptions,
} from '@nestjs/throttler';
import { ThrottlerRequest } from '@nestjs/throttler/dist/throttler.guard.interface';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  apiRequestCounterService: any;

  protected async handleRequest(
    requestProps: ThrottlerRequest,
  ): Promise<boolean> {
    const { context, limit, ttl, throttler, blockDuration } = requestProps;
    const { req, res } = this.getRequestResponse(context);

    const tracker = await this.getTracker(req);
    const key = this.generateKey(context, tracker, 'ip');

    const { totalHits, timeToExpire } = await this.storageService.increment(
      key,
      ttl,
      limit,
      blockDuration,
      throttler.name,
    );

    if (totalHits > limit) {
      res.header('Retry-After', timeToExpire);

      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          error: 'Too Many Requests',
          message: 'Rate limit exceeded.',
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }
}
