import { ValidationError } from 'class-validator';

export const validationErrorsMapper = {
  mapValidationErrorToValidationPipeErrorTArray: (errors: ValidationError[]) =>
    errors.flatMap((error) =>
      Object.entries(error.constraints).map(([_, value]) => ({
        field: error.property,
        message: value,
      })),
    ),
};
