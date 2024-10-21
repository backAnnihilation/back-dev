import * as sharp from 'sharp';
import { ImageSize } from '@app/shared';
import {
  ProcessingImageUseCase,
  ProcessingImageCommand,
} from './processing-images.use-case';
import { ProcessImagesService } from '../services/process-images.service';
import imageSizes, { ImageSizesType } from '../../../../core/utils/image-sizes';

const mockFile = {
  originalname: 'test.jpg',
  mimetype: 'image/jpeg',
  buffer: Buffer.from('test image buffer'),
  size: 1024,
  fieldname: 'file',
  encoding: '7bit',
  destination: '',
  filename: '',
  path: '',
  stream: undefined,
};

describe('ProcessingImageUseCase', () => {
  let processingImageUseCase: ProcessingImageUseCase;
  let entityImageSizes: ImageSizesType;
  let buffer: Buffer;

  beforeEach(() => {
    entityImageSizes = imageSizes.profile;
    buffer = mockFile.buffer;
    const processImageService = new ProcessImagesService();
    processingImageUseCase = new ProcessingImageUseCase(processImageService);
    jest.restoreAllMocks();
  });
  describe('execute', () => {
    it('should process images into multiple sizes', async () => {
      const command = new ProcessingImageCommand({
        buffer,
        imageSizes: entityImageSizes,
      });
      const result = await processingImageUseCase.execute(command);

      for (const [k, v] of result.entries()) {
        expect(Object.values(ImageSize)).toContain(k);
        expect(v).toBeInstanceOf(Buffer);
      }
      expect(result.size).toBe(3);
    });

    it('should resize the image for SMALL and LARGE sizes', async () => {
      const resizeMock = jest.spyOn(sharp.prototype, 'resize').mockReturnThis();

      const command = new ProcessingImageCommand({
        buffer,
        imageSizes: entityImageSizes,
      });
      await processingImageUseCase.execute(command);

      expect(resizeMock).toHaveBeenCalledWith(192, 95);
      expect(resizeMock).toHaveBeenCalledWith(45, 45);
    });

    it('should not resize the ORIGINAL size', async () => {
      const resizeMock = jest.spyOn(sharp.prototype, 'resize');

      const command = new ProcessingImageCommand({
        buffer,
        imageSizes: entityImageSizes,
      });
      await processingImageUseCase.execute(command);

      expect(resizeMock).not.toHaveBeenCalledWith(0, 0);
    });
  });

  describe('convertImageToStorageFormat', () => {
    it('should convert to WebP format and resize when type is not ORIGINAL', async () => {
      const resizeMock = jest.spyOn(sharp.prototype, 'resize').mockReturnThis();
      const toBufferMock = jest
        .spyOn(sharp.prototype, 'toBuffer')
        .mockResolvedValue(Buffer.from('test'));

      const mockBuffer = Buffer.from('test image buffer');
      const result = await processingImageUseCase[
        'convertImageToStorageFormat'
      ](mockBuffer, ImageSize.LARGE, 192, 95);

      expect(resizeMock).toHaveBeenCalledWith(192, 95);
      expect(toBufferMock).toHaveBeenCalled();
    });

    it('should not resize when type is ORIGINAL', async () => {
      const resizeMock = jest.spyOn(sharp.prototype, 'resize');
      const toBufferMock = jest
        .spyOn(sharp.prototype, 'toBuffer')
        .mockResolvedValue(Buffer.from('test'));

      const mockBuffer = Buffer.from('test image buffer');
      await processingImageUseCase['convertImageToStorageFormat'](
        mockBuffer,
        ImageSize.ORIGINAL,
        0,
        0,
      );

      expect(resizeMock).not.toHaveBeenCalled();
      expect(toBufferMock).toHaveBeenCalled();
    });
  });
});
