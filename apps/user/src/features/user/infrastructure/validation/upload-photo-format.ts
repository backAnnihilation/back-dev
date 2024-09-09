import {
  Injectable,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';

@Injectable()
export class ImageFilePipe extends ParseFilePipe {
  constructor() {
    super({
      validators: [
        new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
        new FileTypeValidator({ fileType: /(image\/jpeg|image\/png)/ }),
      ],
    });
  }
}
