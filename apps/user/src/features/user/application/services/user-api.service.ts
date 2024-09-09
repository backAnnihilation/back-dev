import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { BaseCUDApiService } from '../../../../../core/api/services/base-cud-api.service';
import { UserProfileViewModel } from '../../api/models/output/profile.view.model';
import { ProfilesQueryRepo } from '../../api/query-repositories/profiles.query.repo';
import { EditProfileCommand } from '../use-cases/edit-profile.use-case';
import { FillOutProfileCommand } from '../use-cases/fill-out-profile.use-case';

@Injectable()
export class UserProfilesApiService extends BaseCUDApiService<
  FillOutProfileCommand | EditProfileCommand,
  UserProfileViewModel
> {
  constructor(commandBus: CommandBus, queryRepo: ProfilesQueryRepo) {
    super(commandBus, queryRepo);
  }
}
