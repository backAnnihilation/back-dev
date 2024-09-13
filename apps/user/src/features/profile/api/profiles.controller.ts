import { FileType, ImageViewModelType } from '@models/file.models';
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
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { ApiTagsEnum, RoutingEnum } from '@shared/routing';
import { UserNavigate } from '@user/core/routes/user-navigate';
import { UserPayload } from '../../auth/infrastructure/decorators/user-payload.decorator';
import { AccessTokenGuard } from '../../auth/infrastructure/guards/accessToken.guard';
import { UserSessionDto } from '../../security/api/models/security-input.models/security-session-info.model';
import { UserProfileService } from '../application/services/profile.service';
import { UserProfilesApiService } from '../application/services/user-api.service';
import { EditProfileCommand } from '../application/use-cases/edit-profile.use-case';
import { FillOutProfileCommand } from '../application/use-cases/fill-out-profile.use-case';
import { ImageFilePipe } from '../infrastructure/validation/upload-photo-format';
import { SetUserIdGuard } from '../../auth/infrastructure/guards/set-user-id.guard';
import { ExtractUserId } from '../../auth/infrastructure/decorators/current-user-id.decorator';
import { EditProfileInputModel } from './models/input/edit-profile.model';
import { FillOutProfileInputModel } from './models/input/fill-out-profile.model';
import { UserProfileViewModel } from './models/output/profile.view.model';
import { ProfilesQueryRepo } from './query-repositories/profiles.query.repo';
import { EditProfileEndpoint } from './swagger/edit-profile.description';
import { FillOutProfileEndpoint } from './swagger/fill-out-profile.description';
import { GetUserProfileEndpoint } from './swagger/get-profile.description';

@ApiTags(ApiTagsEnum.Profiles)
@Controller(RoutingEnum.profiles)
export class UserProfilesController {
  constructor(
    private commandBus: CommandBus,
    private userProfilesApiService: UserProfilesApiService,
    private profilesQueryRepo: ProfilesQueryRepo,
    private profileService: UserProfileService,
  ) {}

  @GetUserProfileEndpoint()
  @UseGuards(SetUserIdGuard)
  @Get(UserNavigate.GetProfile)
  async getUserProfile(
    @ExtractUserId() userId: string,
    @Param('id') profileId: string,
  ): Promise<UserProfileViewModel> {
    const profile = await this.profilesQueryRepo.getById(profileId);
    if (!profile) throw new NotFoundException('Profile not found');
    return profile;
  }

  @ApiExcludeEndpoint()
  @Post(UserNavigate.UploadPhoto)
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(AccessTokenGuard)
  async uploadProfilePhoto(
    @UserPayload() userPayload: UserSessionDto,
    @UploadedFile(ImageFilePipe)
    image: FileType,
  ): Promise<ImageViewModelType> {
    const result = await this.profileService.uploadProfileImage({
      image,
      userId: userPayload.userId,
    });
    return result.data;
  }

  @FillOutProfileEndpoint()
  @UseGuards(AccessTokenGuard)
  @Post(UserNavigate.FillOutProfile)
  async fillOutProfile(
    @UserPayload() userPayload: UserSessionDto,
    @Body() profileDto: FillOutProfileInputModel,
  ): Promise<UserProfileViewModel> {
    const command = new FillOutProfileCommand({
      ...profileDto,
      userId: userPayload.userId,
    });
    return this.userProfilesApiService.create(command);
  }

  @EditProfileEndpoint()
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
