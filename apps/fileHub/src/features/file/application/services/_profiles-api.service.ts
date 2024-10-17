import {
  BaseCUDApiService,
  IProfileImageViewModelType,
  RmqService,
} from '@app/shared';
import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ProfilesQueryRepository } from '../../api/profile-image.query.repository';
import { UploadProfileImageCommand } from '../use-cases/upload-profile-image.use-case';
import { BaseEventsApiService } from '@file/core/api/services/base-events-api.service';

// @Injectable()
// export class ProfilesApiService extends BaseEventsApiService<
//   UploadProfileImageCommand,
//   IProfileImageViewModelType
// > {
//   constructor(
//     rmqService: RmqService,
//     commandBus: CommandBus,
//     queryRepo: ProfilesQueryRepository,
//   ) {
//     super(rmqService, commandBus, queryRepo);
//   }
// }
