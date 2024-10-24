import { ImageCategory } from '@app/shared';
import { FilesStorageAdapter } from '@file/core/adapters/local-files-storage.adapter';
import { Injectable } from '@nestjs/common';
import { Bucket } from '../../api/models/enums/file-models.enum';
import {
  ContentType,
  UploadFileOutputType,
} from '../../api/models/output-models/file-output-types';

type ImageMeta = {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
};
export type UploadImageType = {
  image: ImageMeta;
  category: ImageCategory;
  profileId?: string;
  imageId?: string;
  postId?: string;
  bucket: Bucket;
};
type GenerateImageKeyType = {
  fileName: string;
  contentType: ContentType;
  category: ImageCategory;
  profileId?: string;
  imageId?: string;
  postId?: string;
};

@Injectable()
export class FilesService {
  constructor(private readonly filesAdapter: FilesStorageAdapter) {}

  async uploadFileInStorage(
    uploadFileDto: UploadImageType,
  ): Promise<UploadFileOutputType> {
    const {
      image: { buffer, mimetype, originalname },
      category,
      postId,
      profileId,
      imageId,
      bucket: Bucket,
    } = uploadFileDto;

    const { ContentType, Key } = this.generateImageKey({
      contentType: mimetype as ContentType,
      fileName: originalname,
      category,
      profileId,
      postId,
      imageId,
    });

    const bucketParams = {
      Bucket,
      Key,
      Body: buffer,
      ContentType,
    };

    return this.filesAdapter.uploadFile(bucketParams);
  }

  generateImageKey = (keyInfo: GenerateImageKeyType) => {
    const { profileId, category, contentType, fileName, postId, imageId } =
      keyInfo;

    const [, fileExtension] = contentType.split('/');
    const timeStamp = new Date().getTime();
    const withExtension = fileName.endsWith(fileExtension);
    const fileSignature = withExtension ? fileName.split('.')[0] : fileName;

    const basePath = this.getBasePathForCategory(
      category,
      postId,
      profileId,
      imageId,
    );

    const generatedKey = `${basePath}/${fileSignature}${timeStamp}.${fileExtension}`;

    return { Key: generatedKey, ContentType: contentType };
  };

  getBasePathForCategory = (
    category: ImageCategory,
    postId?: string,
    profileId?: string,
    imageId?: string,
  ): string =>
    ({
      [ImageCategory.POST]: `images/posts/postId-${postId}`,
      [ImageCategory.PROFILE]: `images/profiles/profileId-${profileId}/imageId-${imageId}`,
    })[category];
}
