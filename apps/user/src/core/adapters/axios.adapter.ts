import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import * as FormData from 'form-data';
import { IPostImageViewModelType } from '@app/shared';
import { EnvironmentVariables } from '../config/configuration';
import { ProfileImageToSendType } from '../../features/profile/api/models/input/upload-file-type.model';

// out of date
@Injectable()
export class AxiosAdapter {
  private readonly axiosInstance: AxiosInstance;
  constructor(private readonly config: ConfigService<EnvironmentVariables>) {
    // this.axiosInstance = axios.create({
    //   baseURL: this.config.get('FILES_SERVICE_URL'),
    //   headers: {
    //     'Content-Type': 'multipart/form-data',
    //     'x-api-key': config.get('API_KEY'),
    //   },
    // });
  }

  async sendPostRequest(
    url: string,
    fileDto: ProfileImageToSendType,
  ): Promise<IPostImageViewModelType> {
    try {
      const formData = new FormData();
      const { image, ...fileTypes } = fileDto;
      const fileType = {
        filename: image.originalname,
        contentType: image.mimetype,
      };
      formData.append('file', image.buffer, fileType);
      formData.append('fileFormat', fileTypes.fileFormat);
      formData.append('fileType', fileTypes.fileType);

      const headers = { ...formData.getHeaders() };

      const response = await this.axiosInstance.post(url, formData, {
        headers,
      });
      return response.data;
    } catch (error) {
      console.log('sendPostRequest', error);
    }
  }
}
