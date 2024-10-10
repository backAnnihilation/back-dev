import { BaseCUDApiService, IProfileImageViewModelType } from '@app/shared';
import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ProfilesQueryRepository } from '../../api/profile-image.query.repository';
import { UploadProfileImageCommand } from '../use-cases/upload-profile-image.use-case';

@Injectable()
export class ProfilesApiService extends BaseCUDApiService<
  UploadProfileImageCommand,
  IProfileImageViewModelType
> {
  constructor(commandBus: CommandBus, queryRepo: ProfilesQueryRepository) {
    super(commandBus, queryRepo);
  }
}
