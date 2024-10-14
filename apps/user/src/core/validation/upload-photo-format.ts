import {
  Injectable,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';

export
@Injectable()
class ImageFilePipe extends ParseFilePipe {
  constructor(readonly options: { maxSizeMb?: number } = {}) {
    const maxSizeMb = options.maxSizeMb * 1024 || 5 * 1024
    super({
      validators: [
        new MaxFileSizeValidator({ maxSize: maxSizeMb * 1024, message: `File max size: ${maxSizeMb} kb` }, ),
        new FileTypeValidator({ fileType: /(image\/jpeg|image\/png)/ }),
      ],
    });
  }
}
