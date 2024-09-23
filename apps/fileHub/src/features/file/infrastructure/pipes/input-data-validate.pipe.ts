import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';

export class ValidatePayloadPipe<T> implements PipeTransform {
  constructor(private readonly dto: new () => T) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    try {
      const transformedValue = plainToClass(this.dto, value) as Object;
      await validateOrReject(transformedValue);
      return transformedValue;
    } catch (e) {
      throw new RpcException(e);
    }
  }
}
