import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Request, Response } from 'express';

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
    const response = ctx.getResponse<Response>() as any;
    const request = ctx.getRequest<Request>();
    const rpcContext = host.switchToRpc();
    const rpcData = rpcContext.getData();
    const rpcCtx = rpcContext.getContext();

    const { message, key, statusCode } = exception.getResponse() as any;
    console.log({ rpcContext, rpcCtx, rpcData });

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

      const envCondition =
        this.currentENV === 'DEVELOPMENT' || this.currentENV === 'TESTING';

      const errorResponse = !envCondition
        ? devErrorResponse
        : prodErrorResponse;

      response.status(statusCode).send(errorResponse);
    } else {
      response.status(statusCode).json(devErrorResponse);
    }
  }
}
