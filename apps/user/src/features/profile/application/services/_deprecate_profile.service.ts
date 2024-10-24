import {
  EVENT_COMMANDS,
  ImageType,
  IProfileImageViewModelType,
  LayerNoticeInterceptor,
  MediaType,
} from '@app/shared';
import { Injectable } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { UploadFileDto } from '../../api/models/input/upload-file-type.model';
import { ProfilesRepository } from '../../infrastructure/profiles.repository';

@Injectable()
export class UserProfileService {
  constructor(
    private profilesRepo: ProfilesRepository,
  ) {}

  // async uploadProfilePhoto(
  //   uploadFileDto: UploadFileDto,
  // ): Promise<ImageViewModelType> {
  //   const { image, userId } = uploadFileDto;
  //   const profile = await this.profilesRepo.getByUserId(userId);
  //   if (!profile) throw new NotFoundException('Profile not found');

  //   const imageToUpload = {
  //     fileFormat: MediaType.IMAGE,
  //     fileType: ImageType.MAIN,
  //     image,
  //   };
  //   const url = `/${profile.id}/upload`;
  //   return await this.resendAdapter.sendPostRequest(url, imageToUpload);
  // }

  async uploadProfileImage(
    uploadFileDto: UploadFileDto,
  ): Promise<LayerNoticeInterceptor<IProfileImageViewModelType>> {
    const notice = new LayerNoticeInterceptor<IProfileImageViewModelType>();
    const { image, userId } = uploadFileDto;
    const profile = await this.profilesRepo.getByUserId(userId);

    if (!profile) {
      notice.addError(
        `Profile wasn't found`,
        'uploadImage',
        notice.errorCodes.ResourceNotFound,
      );
      return notice;
    }

    const imagePayload = {
      fileFormat: MediaType.IMAGE,
      fileType: ImageType.MAIN,
      image,
      profileId: profile.id,
    };

    const transport = Transport.TCP;
    const commandName = EVENT_COMMANDS.PROFILE_IMAGE_UPLOAD;

    // const result = await this.transportManager.sendMessage(
    //   transport,
    //   commandName,
    //   imagePayload,
    // );

    // if (!result) {
    //   notice.addError(
    //     `Image wasn't uploaded`,
    //     'uploadImage',
    //     notice.errorCodes.UnavailableServiceError,
    //   );
    //   return notice;
    // }

    // notice.addData(result);
    return notice;
  }
}
