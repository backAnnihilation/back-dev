import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { FileType } from '../../../../../../libs/shared/models/file.models';
import {
  ApiTagsEnum,
  RoutingEnum,
} from '../../../../../../libs/shared/routing';
import { UserNavigate } from '../../../../core/routes/user-navigate';
import { UserPayload } from '../../auth/infrastructure/decorators/user-payload.decorator';
import { AccessTokenGuard } from '../../auth/infrastructure/guards/accessToken.guard';
import { UserSessionDto } from '../../security/api/models/security-input.models/security-session-info.model';
import { EditProfileCommand } from '../application/use-cases/edit-profile.use-case';
import { FillOutProfileCommand } from '../application/use-cases/fill-out-profile.use-case';
import { ImageFilePipe } from '../infrastructure/validation/upload-photo-format';
import { EditProfileInputModel } from './models/input/edit-profile.model';
import { FillOutProfileInputModel } from './models/input/fill-out-profile.model';
import { UserProfileViewModel } from './models/output/profile.view.model';
import { ProfilesQueryRepo } from './query-repositories/profiles.query.repo';
import { UserProfileService } from '../application/services/profile.service';
import { UserProfilesApiService } from '../application/services/user-api.service';

@ApiTags(ApiTagsEnum.Profiles)
@Controller(RoutingEnum.profiles)
export class UserProfilesController {
  constructor(
    private commandBus: CommandBus,
    private userProfilesApiService: UserProfilesApiService,
    private profilesQueryRepo: ProfilesQueryRepo,
    private profileService: UserProfileService,
  ) {}

  @Get(UserNavigate.GetProfile)
  async getUserProfile(
    @Param('id') profileId: string,
  ): Promise<UserProfileViewModel> {
    const profile = await this.profilesQueryRepo.getById(profileId);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }

  @Post(UserNavigate.UploadPhoto)
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(AccessTokenGuard)
  async uploadProfilePhoto(
    @UserPayload() userPayload: UserSessionDto,
    @UploadedFile(ImageFilePipe)
    image: FileType,
  ) {
    return this.profileService.uploadProfilePhoto({
      image,
      userId: userPayload.userId,
    });
  }

  @UseGuards(AccessTokenGuard)
  @Post(UserNavigate.FillOutProfile)
  async fillOutProfile(
    @UserPayload() userPayload: UserSessionDto,
    @Body() profileDto: FillOutProfileInputModel,
  ) {
    const command = new FillOutProfileCommand({
      ...profileDto,
      userId: userPayload.userId,
    });
    return this.userProfilesApiService.create(command);
  }

  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(UserNavigate.EditProfile)
  async editProfile(
    @UserPayload() userPayload: UserSessionDto,
    @Body() profileDto: EditProfileInputModel,
  ) {
    const command = new EditProfileCommand({
      ...profileDto,
      userId: userPayload.userId,
    });
    await this.userProfilesApiService.updateOrDelete(command);
  }
}
