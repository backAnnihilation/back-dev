import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { validateOrReject, ValidationError } from 'class-validator';

type ExceptionType =
  | InternalServerErrorException
  | NotFoundException
  | BadRequestException
  | ForbiddenException;

export class LayerNoticeInterceptor<D = null> {
  public errorCodes: ErrorCodes;
  public data: D | null = null;
  public extensions: LayerInterceptorExtension[] = [];
  public code = 0;

  constructor(
    data: D | null = null,
    public errorMessage?: string,
  ) {
    this.data = data;
    this.errorCodes = {
      InternalServerError: 500,
      ResourceNotFound: 404,
      AccessForbidden: 403,
      UnauthorizedAccess: 401,
      ValidationError: 400,
    };
  }

  async validateFields(model: any) {
    try {
      await validateOrReject(model);
    } catch (errors) {
      (errors as ValidationError[]).forEach((e) => {
        const constraints = Object.values(e.constraints || {});
        for (const constraint of constraints) {
          this.addError(
            constraint,
            e.property,
            this.errorCodes.ValidationError,
          );
        }
      });
    }
  }

  public addData(data: D): void {
    this.data = data;
  }
  public addError(
    message: string,
    key: string | null = null,
    code: number | null = null,
  ): void {
    this.code = code ?? 1;
    this.extensions.push(new LayerInterceptorExtension(message, key));
  }
  get hasError(): boolean {
    return this.code !== 0;
  }

  get generateErrorResponse(): ExceptionType {
    const extension = this.extensions[0];
    const { key, message } = extension;
    const { errorCodes } = this;
    const errorObject = {
      message,
      statusCode: this.code,
      key,
    };

    const errorMap = {
      [errorCodes.InternalServerError]: new InternalServerErrorException(
        errorObject,
      ),
      [errorCodes.ResourceNotFound]: new NotFoundException(errorObject),
      [errorCodes.AccessForbidden]: new ForbiddenException(errorObject),
      [errorCodes.UnauthorizedAccess]: new UnauthorizedException(errorObject),
      [errorCodes.ValidationError]: new BadRequestException(errorObject),
    };

    return errorMap[this.code] || errorMap[errorCodes.InternalServerError];
  }
}

export class LayerInterceptorExtension {
  constructor(
    public readonly message: string,
    public readonly key: string | null = null,
  ) {}
}

type ErrorCodes = {
  InternalServerError: 500;
  ResourceNotFound: 404;
  AccessForbidden: 403;
  UnauthorizedAccess: 401;
  ValidationError: 400;
};
