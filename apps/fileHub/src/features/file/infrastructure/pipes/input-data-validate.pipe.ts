import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { plainToClass } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';
import { validationErrorsMapper } from '@app/shared';

export class ValidatePayloadPipe<T> implements PipeTransform {
  constructor(private readonly dto: new () => T) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    try {
      const transformedValue = plainToClass(this.dto, value) as Object;
      await validateOrReject(transformedValue);
      return transformedValue;
    } catch (e) {
      const errorResponse =
        validationErrorsMapper.mapErrorToValidationPipeError(e);
      throw new RpcException(errorResponse);
    }
  }
}
