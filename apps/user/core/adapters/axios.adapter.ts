import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { EnvironmentVariables } from '../config/configuration';
import { FileType } from '../../../../libs/shared/models/file.models';
import * as FormData from 'form-data';

@Injectable()
export class AxiosAdapter {
  private readonly axiosInstance: AxiosInstance;
  constructor(private readonly config: ConfigService<EnvironmentVariables>) {
    this.axiosInstance = axios.create({
      baseURL: this.config.get('FILES_SERVICE_URL'),
      headers: {
        Authorization: `Bearer ${this.config.get('ACCESS_TOKEN_SECRET')}`,
        'Content-Type': 'multipart/form-data',
        'x-api-key': config.get('API_KEY'),
      },
    });
  }

  async sendPostRequest(url: string, file: FileType): Promise<void> {
    try {
      const formData = new FormData();

      formData.append('file', file.buffer, {
        filename: file.originalname,
        contentType: file.mimetype,
      });

      const headers = { ...formData.getHeaders() };

      const response = await this.axiosInstance
        .post(url, formData, { headers })
      
    } catch (error) {
      console.log('sendPostRequest', error);
    }
  }
}
