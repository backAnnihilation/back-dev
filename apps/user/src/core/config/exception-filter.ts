import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Environment } from '@app/shared';

type ErrorResponse = {
  errorsMessages: ErrorsMessageType[];
};
type ErrorsMessageType = {
  message?: string;
  field?: string;
};

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private currentENV: string) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const { message, key, statusCode } = exception.getResponse() as any;

    const devErrorResponse = {
      statusCode,
      timestamp: new Date().toISOString(),
      location: key,
      error: message,
      path: request.url,
      errorName: exception?.name,
    };

    if (statusCode === HttpStatus.BAD_REQUEST) {
      const prodErrorResponse: ErrorResponse = {
        errorsMessages: [],
      };
      if (Array.isArray(message)) {
        message.forEach((m: ErrorsMessageType) => {
          prodErrorResponse.errorsMessages.push(m);
        });
      } else {
        prodErrorResponse.errorsMessages.push({ message });
      }

      const testEnvironment =
        this.currentENV === Environment.DEVELOPMENT ||
        this.currentENV === Environment.TESTING;

      const errorResponse = !testEnvironment
        ? devErrorResponse
        : prodErrorResponse;

      response.status(statusCode).send(errorResponse);
    } else {
      response.status(statusCode).json(devErrorResponse);
    }
  }
}
