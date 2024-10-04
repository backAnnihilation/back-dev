import { INestApplication, INestMicroservice } from '@nestjs/common';

import { RmqService } from '@app/shared';
import { MicroserviceExceptionFilter } from '@file/core/configuration/rpc-exception-filter';

import { HttpExceptionFilter } from './exception-filter';

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
