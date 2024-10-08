import {
  ApiTagsEnum,
  IMAGES_DELIVERED,
  POST_CREATED,
  PROFILE_IMAGE,
  RmqService,
  RoutingEnum,
} from '@app/shared';
import { Controller } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
  TcpContext,
} from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import {
  FilesApiService,
  Service,
} from '../application/services/file.base.service';
import { UploadPostImageCommand } from '../application/use-cases/upload-post-image.use-case';
import { UploadProfileImageCommand } from '../application/use-cases/upload-profile-image.use-case';
import { ValidatePayloadPipe } from '../infrastructure/pipes/input-data-validate.pipe';
import { InputPostImageDto } from './models/input-models/post-image.model';
import { InputProfileImageDto } from './models/input-models/profile-image.model';
import { ProfileImageDeliveryApprovedCommand } from '../application/use-cases/approved-profile-image-urls-delivery.use-case';
import { CommandBus } from '@nestjs/cqrs';

@ApiTags(ApiTagsEnum.Files)
@Controller(RoutingEnum.files)
export class FilesController {
  constructor(
    private filesApiService: FilesApiService,
    private rmqService: RmqService,
    private commandBus: CommandBus,
  ) {}

  @EventPattern(PROFILE_IMAGE)
  handleUploadProfileImageEvent(
    @Payload(new ValidatePayloadPipe(InputProfileImageDto))
    data: InputProfileImageDto,
    @Ctx() context: TcpContext,
  ) {
    const command = new UploadProfileImageCommand(data);
    return this.filesApiService.uploadImage(Service.PROFILE, command);
  }

  @EventPattern(IMAGES_DELIVERED)
  async approvedDeliveredImage(
    @Payload() data: { eventId: string },
    @Ctx() context: RmqContext,
  ) {
    console.log('approvedDeliveredImage', { data });
    this.rmqService.ack(context);
    const command = new ProfileImageDeliveryApprovedCommand(data.eventId);
    this.commandBus.execute(command);
  }

  @MessagePattern(POST_CREATED)
  async handleUploadPostImage(
    @Payload(new ValidatePayloadPipe(InputPostImageDto))
    data: InputPostImageDto,
    @Ctx() context: RmqContext,
  ) {
    const command = new UploadPostImageCommand(data);
    return this.filesApiService.uploadImage(Service.POST, command, context);
  }

  @EventPattern('emit')
  handleUploadFile(
    @Payload() data?: InputProfileImageDto,
    @Ctx() context?: RmqContext,
  ) {
    console.log({ data });

    this.rmqService.ack(context);
  }

  @MessagePattern('tcp-data')
  async sendMessage(@Payload() data: number[], @Ctx() context: any) {
    console.log({ data, context });
  }
}
