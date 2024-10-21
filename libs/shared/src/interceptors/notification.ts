import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { IEvent } from '@nestjs/cqrs';
import { validateOrReject } from 'class-validator';
import { validationErrorsMapper } from '../validation/validation-errors-mapper';

type ExceptionType =
  | InternalServerErrorException
  | NotFoundException
  | BadRequestException
  | ForbiddenException
  | UnauthorizedException
  | ServiceUnavailableException;

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
      UnavailableServiceError: 503,
      InternalServerError: 500,
      ResourceNotFound: 404,
      AccessForbidden: 403,
      UnauthorizedAccess: 401,
      ValidationError: 400,
    };
  }

  async validateEntity<T extends Object>(model: T, ...events: IEvent[]) {
    try {
      await validateOrReject(model);
    } catch (errors) {
      const mappedErrors =
        validationErrorsMapper.mapErrorToValidationPipeError(errors);
      const errorNotice: DomainNotification<T> =
        validationErrorsMapper.mapErrorsToNotification(mappedErrors);

      errorNotice.addEvents(...events);
      return errorNotice;
    }
    const domainNotice = new DomainNotification<T>(model);
    domainNotice.addEvents(...events);
    return domainNotice;
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

  protected setCode(code: number): void {
    this.code = code;
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
      [errorCodes.UnavailableServiceError]: new ServiceUnavailableException(
        errorObject,
      ),
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
  UnavailableServiceError: 503;
  InternalServerError: 500;
  ResourceNotFound: 404;
  AccessForbidden: 403;
  UnauthorizedAccess: 401;
  ValidationError: 400;
};

export class DomainNotification<
  TData = null,
> extends LayerNoticeInterceptor<TData> {
  readonly events: IEvent[] = [];

  addEvents(...events: IEvent[]) {
    this.events.concat(events);
  }

  static createError(
    message: string,
    key: string | null = null,
    code: number | null = null,
  ) {
    const notification = new DomainNotification();
    notification.addError(message, key, code);
    return notification;
  }

  static merge<T>(
    mainNotice: DomainNotification<T>,
    ...notifications: DomainNotification<T>[]
  ) {
    const domainNotice = new DomainNotification<T>();

    if (mainNotice.data) {
      domainNotice.addData(mainNotice.data);
    }
    domainNotice.addEvents(...mainNotice.events);

    const addMainErrors = (notice: DomainNotification<T>) => {
      notice.extensions.forEach(({ message, key }) => {
        domainNotice.addError(message, key);
      });
    };
    addMainErrors(mainNotice);
    notifications.forEach((notice) => {
      domainNotice.events.concat(...notice.events);
      addMainErrors(notice);
    });

    return domainNotice;
  }
}
