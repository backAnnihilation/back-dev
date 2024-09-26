import {
  BadRequestException,
  INestApplication,
  INestMicroservice,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { validationErrorsMapper } from '../validation/validation-utils';

export const pipesSetup = (app: INestApplication | INestMicroservice) => {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      stopAtFirstError: true,
      exceptionFactory(errors: ValidationError[]) {
        const customErrors: ValidationPipeErrorType[] =
          validationErrorsMapper.mapValidationErrorToValidationPipeErrorTArray(
            errors,
          );

        throw new BadRequestException(customErrors);
      },
    }),
  );
};

export type ValidationPipeErrorType = {
  field: string;
  message: string;
};
