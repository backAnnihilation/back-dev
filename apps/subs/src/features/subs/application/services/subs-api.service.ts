import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { UserProfileViewModel } from '../../api/models/output/profile.view.model';
import { ProfilesQueryRepo } from '../../api/query-repositories/profiles.query.repo';
import { EditProfileCommand } from '../use-cases/edit-profile.use-case';
import { FillOutProfileCommand } from '../use-cases/fill-out-profile.use-case';
import { BaseCUDApiService, IProfileImageViewModelType } from '@app/shared';
import { UploadProfileImageCommand } from '../use-cases/upload-profile-image.use-case';
import { SubscribeCommand } from '../use-cases/upload-file.use-case';
import { SubsQueryRepo } from '../../api/subs.query.repo';

@Injectable()
export class SubsApiService extends BaseCUDApiService<SubscribeCommand, any> {
  constructor(commandBus: CommandBus, queryRepo: SubsQueryRepo) {
    super(commandBus, queryRepo);
  }
}
