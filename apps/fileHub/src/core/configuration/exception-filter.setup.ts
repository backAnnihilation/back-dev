import { INestApplication, INestMicroservice } from '@nestjs/common';
import { HttpExceptionFilter } from './exception-filter';
import { MicroserviceExceptionFilter } from './rpc-exception-filter';
import { RmqService } from '@app/shared';

export const exceptionFilterSetup = (
  app: INestApplication | INestMicroservice,
  env: string,
) => {
  const rmqService = app.get(RmqService);
  app.useGlobalFilters(
    new HttpExceptionFilter(env),
    new MicroserviceExceptionFilter(rmqService),
  );
};
