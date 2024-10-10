import {
  Injectable,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';

@Injectable()
export class ImagePhotoPipe extends ParseFilePipe {
  constructor() {
    super({
      validators: [
        new MaxFileSizeValidator({ maxSize: 20 * 1024 * 1024 }),
        new FileTypeValidator({ fileType: /(image\/jpeg|image\/png)/ }),
      ],
    });
  }
}
