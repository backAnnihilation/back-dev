import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import { ImageSize } from '@app/shared';

@Injectable()
export class ProcessImagesService {
  constructor() {}

  convertImageToStorageFormat = async (
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
}
