import {
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { IsString } from 'class-validator';
import { LayerNoticeInterceptor } from './notification';

class TestModel {
  @IsString()
  testField: string;
}

describe('LayerNoticeInterceptor', () => {
  let interceptor: LayerNoticeInterceptor<any>;

  beforeEach(() => {
    interceptor = new LayerNoticeInterceptor();
  });

  it('should initialize with correct default values', () => {
    expect(interceptor.data).toBe(null);
    expect(interceptor.code).toBe(0);
    expect(interceptor.extensions).toHaveLength(0);
    expect(interceptor.hasError).toBe(false);
  });

  it('should add data correctly', () => {
    const testData = { some: 'data' };
    interceptor.addData(testData);
    expect(interceptor.data).toBe(testData);
  });

  it('should add error and set correct error code', () => {
    interceptor.addError('Some error message', 'testField', 400);
    expect(interceptor.extensions).toHaveLength(1);
    expect(interceptor.extensions[0].message).toBe('Some error message');
    expect(interceptor.extensions[0].key).toBe('testField');
    expect(interceptor.code).toBe(400);
    expect(interceptor.hasError).toBe(true);
  });

  it('should generate correct error response for 500 (InternalServerError)', () => {
    interceptor.addError('Internal error occurred', null, 500);
    const errorResponse = interceptor.generateErrorResponse;
    expect(errorResponse).toBeInstanceOf(InternalServerErrorException);
    expect(errorResponse.message).toBe('Internal error occurred');
    errorResponse;
  });

  it('should generate correct error response for 404 (NotFound)', () => {
    interceptor.addError('Resource not found', 'resource', 404);
    const errorResponse = interceptor.generateErrorResponse;
    expect(errorResponse).toBeInstanceOf(NotFoundException);
    expect(errorResponse.message).toBe('Resource not found');
  });

  it('should generate correct error response for 400 (ValidationError)', () => {
    interceptor.addError('Validation error', 'field', 400);
    const errorResponse = interceptor.generateErrorResponse;
    expect(errorResponse).toBeInstanceOf(BadRequestException);
    expect(errorResponse.message).toBe('Validation error');
  });

  it('should generate correct error response for 403 (Forbidden)', () => {
    interceptor.addError('Access forbidden', null, 403);
    const errorResponse = interceptor.generateErrorResponse;
    expect(errorResponse).toBeInstanceOf(ForbiddenException);
    expect(errorResponse.message).toBe('Access forbidden');
  });

  it('should validate fields correctly and add validation error', async () => {
    const invalidModel = new TestModel();
    invalidModel.testField = 123 as any;

    await interceptor.validateFields(invalidModel);

    expect(interceptor.extensions).toHaveLength(1);
    expect(interceptor.code).toBe(400);
    expect(interceptor.extensions[0].message).toContain('must be a string');
  });

  it('should not add errors when validation passes', async () => {
    const validModel = new TestModel();
    validModel.testField = 'validString';

    await interceptor.validateFields(validModel);

    expect(interceptor.extensions).toHaveLength(0);
    expect(interceptor.hasError).toBe(false);
  });
});
