import { HttpStatus } from '@nestjs/common';
import { ValidationPipeErrorType } from '../../../src/core';

export interface SuperTestBody<T = unknown> {
  body: T & {
    errors: string[];
    errorsMessages: ValidationPipeErrorType[];
  };
  status: string | HttpStatus;
}
