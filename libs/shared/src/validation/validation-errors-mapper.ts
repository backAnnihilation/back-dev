import { ValidationError } from 'class-validator';
import { ValidationPipeErrorType } from '@user/core';
import { DomainNotification } from '../interceptors/notification';

export const validationErrorsMapper = {
  mapErrorToValidationPipeError: (
    errors: ValidationError[],
  ): ValidationPipeErrorType[] =>
    errors.flatMap(({ constraints, property: field }) =>
      Object.entries(constraints).map(([_, message]) => ({
        field,
        message,
      })),
    ),
  mapErrorsToNotification: (errors: ValidationPipeErrorType[]) => {
    const resultNotification = new DomainNotification();
    errors.forEach(({ message, field }) => {
      resultNotification.addError(message, field, 1);
    });
    return resultNotification;
  },
};
