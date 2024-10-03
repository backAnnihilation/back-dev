import { FileMetadata, ImageSize } from '@app/shared';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import * as sharp from 'sharp';

export class ProcessingImageCommand {
  constructor(public imageDto: FileMetadata) {}
}

@CommandHandler(ProcessingImageCommand)
export class ProcessingImageUseCase
  implements ICommandHandler<ProcessingImageCommand>
{
  async execute(
    command: ProcessingImageCommand,
  ): Promise<Map<ImageSize, Buffer>> {
    let { buffer } = command.imageDto;

    buffer = Buffer.isBuffer(buffer)
      ? buffer
      : Buffer.from((buffer as any).data || buffer);

    const imageSizes = [
      { type: ImageSize.ORIGINAL, width: 0, height: 0 },
      { type: ImageSize.LARGE, width: 192, height: 95 },
      { type: ImageSize.SMALL, width: 45, height: 45 },
    ];

    const processedImages = new Map<ImageSize, Buffer>();
    for (const { type, width, height } of imageSizes) {
      const convertedImage = await this.convertImageToStorageFormat(
        buffer,
        type,
        width,
        height,
      );
      processedImages.set(type, convertedImage);
    }
    return processedImages;
  }

  private convertImageToStorageFormat = async (
    buffer: Buffer,
    type: ImageSize,
    width: number,
    height: number,
  ) => {
    const convertedWebpFormat = sharp(buffer).webp({ quality: 80 });
    let convertedBuffer: Buffer;
    if (type === ImageSize.ORIGINAL) {
      convertedBuffer = await convertedWebpFormat.toBuffer();
    } else {
      convertedBuffer = await convertedWebpFormat
        .resize(width, height)
        .toBuffer();
    }

    return convertedBuffer;
  };

  private isBuffer = (obj: any): obj is Buffer => {
    return (
      obj !== null &&
      typeof obj === 'object' &&
      obj.constructor.name === 'Buffer'
    );
  };
}
