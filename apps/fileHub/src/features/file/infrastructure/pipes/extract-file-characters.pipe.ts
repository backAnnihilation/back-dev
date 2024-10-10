import { FileMetadata } from '@app/shared';
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class FileExtractPipe implements PipeTransform {
  transform(file: FileMetadata, metadata: ArgumentMetadata) {
    if (!file) {
      throw new Error('No file provided');
    }

    return {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      buffer: file.buffer,
    };
  }
}
