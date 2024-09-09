import { Injectable } from '@nestjs/common';
import { FileType } from '../../../../../../../libs/shared/models/file.models';
import { AxiosAdapter } from '../../../../../core/adapters/axios.adapter';

@Injectable()
export class UserProfileService {
  constructor(private resendAdapter: AxiosAdapter) {}

  async uploadProfilePhoto(uploadFileDto: UploadFileDto): Promise<void> {
    const { image, userId } = uploadFileDto;
    const url = `/${userId}/upload`;
    await this.resendAdapter.sendPostRequest(url, image);
  }
}

export type UploadFileDto = {
  image: FileType;
  userId: string;
};
