import {
  Injectable,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';

type ImageFilePipeOptions = {
  maxSizeMb: number;
};

@Injectable()
export class ImageFilePipe extends ParseFilePipe {
  constructor(readonly options: ImageFilePipeOptions) {
    const maxSizeMb = options.maxSizeMb * 1024;
    super({
      validators: [
        new MaxFileSizeValidator({
          maxSize: maxSizeMb * 1024,
          message: `The photo must bet less than ${maxSizeMb} Mb`,
        }),
        new FileTypeValidator({ fileType: /(image\/jpeg|image\/png)/ }),
      ],
    });
  }
}
