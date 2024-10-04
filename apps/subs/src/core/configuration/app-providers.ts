import { Provider } from '@nestjs/common';
import { TransportManager } from '@user/core/managers/transport.manager';
import { RmqAdapter, TcpAdapter } from '@user/core/adapters';

import { SubsApiService } from '../../features/subs/application/services/subs-api.service';
import { SubsQueryRepo } from '../../features/subs/api/subs.query.repo';
import { UnsubscribeUseCase } from '../../features/subs/application/use-cases/unsubscription.use-case';
import { SubsRepository } from '../../features/subs/domain/subs-repository';
import { SubscribeUseCase } from '../../features/subs/application/use-cases/subscription.use-case';
import { SubscriptionService } from '../../features/subs/application/services/subs-service';
import { ApiKeyGuard } from '../../../../fileHub/src/features/file/infrastructure/guards/api-key.guard';
import { FILES_SERVICE } from '@app/shared';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

export const providers: Provider[] = [
  SubsApiService,
  SubsQueryRepo,
  UnsubscribeUseCase,
  SubsRepository,
  SubscribeUseCase,
  SubscriptionService,
  ApiKeyGuard,
  UnsubscribeUseCase,
  RmqAdapter,
  {
    provide: FILES_SERVICE,
    useFactory: () => {
      return ClientProxyFactory.create({
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'FILES',
          queueOptions: {
            durable: false,
          },
        },
      });
    },
  },
];
