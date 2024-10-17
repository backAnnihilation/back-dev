import { ValidationError } from 'class-validator';

type ValidationErrorResponse = {
  field: string;
  message: string;
}[];

export const validationErrorsMapper = {
  mapValidationErrorToValidationPipeErrorTArray: (
    errors: ValidationError[],
  ): ValidationErrorResponse =>
    errors.flatMap(({ constraints, property: field }) =>
      Object.entries(constraints).map(([_, message]) => ({
        field,
        message,
      })),
    ),
};
