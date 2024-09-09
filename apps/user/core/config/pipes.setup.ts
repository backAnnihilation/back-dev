import {
  BadRequestException,
  INestApplication,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { swaggerSetup } from './swagger/swagger.setup';
import { validationErrorsMapper } from '../validation/validation-utils';

export const pipesSetup = (app: INestApplication) => {
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
  swaggerSetup(app);
};

export type ValidationPipeErrorType = {
  field: string;
  message: string;
};
