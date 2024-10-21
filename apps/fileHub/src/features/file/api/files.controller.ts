import {
  ApiTagsEnum,
  IMAGES_DELIVERED,
  POST_IMAGE_UPLOAD,
  PROFILE_IMAGE_UPLOAD,
  RmqService,
  RoutingEnum,
} from '@app/shared';
import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
  TcpContext,
} from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { FilesApiService } from '../application/services/file.base.service';
import { ProfileImageDeliveryApprovedCommand } from '../application/use-cases/approved-profile-image-urls-delivery.use-case';
import { UploadPostImageCommand } from '../application/use-cases/upload-post-image.use-case';
import { UploadProfileImageCommand } from '../application/use-cases/upload-profile-image.use-case';
import { ValidatePayloadPipe } from '../infrastructure/pipes/input-data-validate.pipe';
import { InputPostImageDto } from './models/input-models/post-image.model';
import { InputProfileImageDto } from './models/input-models/profile-image.model';

@ApiTags(ApiTagsEnum.Files)
@Controller(RoutingEnum.files)
export class FilesController {
  constructor(
    private filesApiService: FilesApiService,
    private rmqService: RmqService,
    private commandBus: CommandBus,
  ) {}

  @EventPattern(PROFILE_IMAGE_UPLOAD)
  handleUploadProfileImageEvent(
    @Payload(new ValidatePayloadPipe(InputProfileImageDto))
    data: InputProfileImageDto,
    @Ctx() context: TcpContext,
  ) {
    const command = new UploadProfileImageCommand(data);
    return void this.filesApiService.uploadImage({ command, context });
  }

  @EventPattern(IMAGES_DELIVERED)
  async approvedDeliveredImage(
    @Payload() data: { eventId: string },
    @Ctx() context: RmqContext,
  ) {
    console.log('GET Image to approved delivery', { data });
    this.rmqService.ack(context);
    const command = new ProfileImageDeliveryApprovedCommand(data.eventId);
    const microserviceNotice = await this.commandBus.execute(command);
    // if (microserviceNotice.hasError) {
    //   const failedEvent = new NoticeFailedEventApprove()

    // }
  }

  @MessagePattern(POST_IMAGE_UPLOAD)
  async handleUploadPostImage(
    @Payload(new ValidatePayloadPipe(InputPostImageDto))
    data: InputPostImageDto,
    @Ctx() context: TcpContext,
  ) {
    const command = new UploadPostImageCommand(data);
    return this.filesApiService.uploadImage({
      command,
      context,
      withResponse: true,
    });
  }
}
