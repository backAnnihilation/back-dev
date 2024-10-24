import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  RpcExceptionFilter,
} from '@nestjs/common';
import { RmqContext, RpcException } from '@nestjs/microservices';
import { Observable, of, throwError } from 'rxjs';
import { RmqService } from '@app/shared';

@Catch(RpcException)
export class MicroserviceExceptionFilter
  implements RpcExceptionFilter<RpcException>
{
  constructor(rmqService: RmqService) {}

  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    console.log('MicroserviceExceptionFilter');
    const errors = exception.getError() as any[];
    const context = host.switchToRpc();
    const data = context.getData();
    const ctx = context.getContext();

    for (const error of errors) {
      console.log({ error });
    }
    console.log({ exception: exception.getError() });

    const errorResponse = {
      message: exception.message || 'Internal RPC error',
      data: data || null,
    };

    return of(exception.getError());
    return throwError(() => new RpcException(errorResponse));
  }
}
