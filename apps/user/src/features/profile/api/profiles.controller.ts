import {
  ApiTagsEnum,
  BaseEvent,
  FileMetadata,
  IMAGES_COMPLETED,
  IMAGES_PROCESSED,
  RmqService,
  RoutingEnum,
} from '@app/shared';
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { CurrentUserId } from '@user/core/decorators/current-user-id.decorator';
import { UserNavigate } from '@user/core/routes/user-navigate';
import { UserPayload } from '../../auth/infrastructure/decorators/user-payload.decorator';
import { AccessTokenGuard } from '../../auth/infrastructure/guards/accessToken.guard';
import { UserIdExtractor } from '../../auth/infrastructure/guards/set-user-id.guard';
import { UserSessionDto } from '../../security/api/models/security-input.models/security-session-info.model';
import { UserProfilesApiService } from '../application/services/user-api.service';
import { EditProfileCommand } from '../application/use-cases/edit-profile.use-case';
import { FillOutProfileCommand } from '../application/use-cases/fill-out-profile.use-case';
import { HandleFilesEventCommand } from '../application/use-cases/handle-files-event.use-case';
import { UploadProfileImageCommand } from '../application/use-cases/upload-profile-image.use-case';
import { ImageFilePipe } from '../infrastructure/validation/upload-photo-format';
import { EditProfileInputModel } from './models/input/edit-profile.model';
import { FillOutProfileInputModel } from './models/input/fill-out-profile.model';
import { ProfileImageProcessType } from './models/output/profile-image-upload-type.model';
import { UserProfileViewModel } from './models/output/profile.view.model';
import { ProfilesQueryRepo } from './query-repositories/profiles.query.repo';
import { EditProfileEndpoint } from './swagger/edit-profile.description';
import { FillOutProfileEndpoint } from './swagger/fill-out-profile.description';
import { GetUserProfileEndpoint } from './swagger/get-profile.description';

@ApiTags(ApiTagsEnum.Profiles)
@Controller(RoutingEnum.profiles)
export class UserProfilesController {
  constructor(
    private userProfilesApiService: UserProfilesApiService,
    private profilesQueryRepo: ProfilesQueryRepo,
    private commandBus: CommandBus,
    private rmqService: RmqService,
  ) {}

  @GetUserProfileEndpoint()
  @UseGuards(UserIdExtractor)
  @Get(UserNavigate.GetProfile)
  async getUserProfile(
    @CurrentUserId() userId: string,
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
    @UserPayload() { userId }: UserSessionDto,
    @UploadedFile(ImageFilePipe)
    image: FileMetadata,
  ): Promise<ProfileImageProcessType> {
    const command = new UploadProfileImageCommand({ image, userId });
    const notice = await this.commandBus.execute(command);
    if (notice.hasError) throw notice.generateErrorResponse;
    console.log({response: notice.data});
    return notice.data;
  }

  @Get(UserNavigate.GetProfileWithImage)
  @UseGuards(AccessTokenGuard)
  async getProfileImageInfo(@UserPayload() userPayload: UserSessionDto) {
    const result = await this.profilesQueryRepo.getProfileImage(
      userPayload.userId,
    );
    if (!result) throw new NotFoundException('Profile image not found');
    return result;
  }

  @Get(UserNavigate.GetProfileWithImage)
  @UseGuards(AccessTokenGuard)
  async getProfileImages(@UserPayload() userPayload: UserSessionDto) {
    const result = await this.profilesQueryRepo.getProfileImage(
      userPayload.userId,
    );
    if (!result) throw new NotFoundException('Profile image not found');
    return result;
  }

  @EventPattern(IMAGES_PROCESSED)
  async handleEvent<T extends BaseEvent>(
    @Payload() data: T,
    @Ctx() context: RmqContext,
  ) {
    this.rmqService.ack(context);
    console.log('RECEIVE IMAGE URLS FROM FILE-HUB', { data });
    const command = new HandleFilesEventCommand(data);
    await this.commandBus.execute(command);
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
    return (await this.userProfilesApiService.create(
      command,
    )) as UserProfileViewModel;
  }

  @EditProfileEndpoint()
  @UseGuards(AccessTokenGuard)
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
