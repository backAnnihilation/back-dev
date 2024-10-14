import { ImageSize } from '@app/shared';
import { ImageSizesType } from '@file/core/utils/image-sizes';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ProcessImagesService } from '../services/process-images.service';

type ProcessingImageCommandType = {
  buffer: Buffer;
  imageSizes: ImageSizesType;
};

export class ProcessingImageCommand {
  constructor(public dto: ProcessingImageCommandType) {}
}

@CommandHandler(ProcessingImageCommand)
export class ProcessingImageUseCase
  implements ICommandHandler<ProcessingImageCommand>
{
  constructor(private processImageService: ProcessImagesService) {}
  async execute(
    command: ProcessingImageCommand,
  ): Promise<Map<ImageSize, Buffer>> {
    let { buffer, imageSizes } = command.dto;

    buffer = Buffer.isBuffer(buffer)
      ? buffer
      : Buffer.from((buffer as any).data || buffer);

    const processedImages = new Map<ImageSize, Buffer>();
    for (const { type, width, height } of imageSizes) {
      const convertedImage =
        await this.processImageService.convertImageToStorageFormat(
          buffer,
          type,
          width,
          height,
        );
      processedImages.set(type, convertedImage);
    }
    return processedImages;
  }
}
