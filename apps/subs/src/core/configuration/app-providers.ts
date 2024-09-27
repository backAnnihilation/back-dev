import { Provider } from '@nestjs/common';
import { SubsApiService } from '../../features/subs/application/services/subs-api.service';
import { SubsQueryRepo } from '../../features/subs/api/subs.query.repo';
import { TransportManager } from '@user/core/managers/transport.manager';
import { UnsubscribeUseCase } from '../../features/subs/application/use-cases/unsubscription.use-case';
import { SubsRepository } from '../../features/subs/domain/subs-repository';
import { SubscribeUseCase } from '../../features/subs/application/use-cases/subscription.use-case';

export const providers: Provider[] = [
  SubsApiService,
  SubsQueryRepo,
  TransportManager,
  UnsubscribeUseCase,
  SubsRepository,
  SubscribeUseCase,
];
