import {
  BadRequestException,
  INestApplication,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { validationErrorsMapper } from '@app/shared';

export const pipesSetup = (app: INestApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      stopAtFirstError: true,
      exceptionFactory(errors: ValidationError[]) {
        const customErrors: ValidationPipeErrorType[] =
          validationErrorsMapper.mapErrorToValidationPipeError(errors);
        throw new BadRequestException(customErrors);
      },
    }),
  );
};

export type ValidationPipeErrorType = {
  field: string;
  message: string;
};
