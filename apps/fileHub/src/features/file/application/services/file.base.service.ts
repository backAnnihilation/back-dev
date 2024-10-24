import { Injectable } from '@nestjs/common';
import { RmqContext, TcpContext } from '@nestjs/microservices';
import { BaseEventsApiService } from '../../../../core/api/services/base-events-api.service';
import { UploadPostImageCommand } from '../use-cases/upload-post-image.use-case';
import { UploadProfileImageCommand } from '../use-cases/upload-profile-image.use-case';
import { RmqService } from '@app/shared';
import { CommandBus } from '@nestjs/cqrs';

@Injectable()
export class FilesApiService extends BaseEventsApiService<
  UploadPostImageCommand | UploadProfileImageCommand
> {
  constructor(rmqService: RmqService, bus: CommandBus) {
    super(rmqService, bus);
  }

  uploadImage(dto: UploadImageType) {
    return this.handleEvent(dto.command, dto.context, dto.withResponse);
  }
}

type UploadImageType = {
  command: UploadPostImageCommand | UploadProfileImageCommand;
  context: RmqContext | TcpContext;
  withResponse?: boolean;
}

export enum Service {
  PROFILE = 'PROFILE',
  POST = 'POST',
}
