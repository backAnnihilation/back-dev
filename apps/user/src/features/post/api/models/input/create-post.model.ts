import { descriptionLength, FileMetadata, iSValidField } from '@app/shared';

export class CreatePostInputModel {
  @iSValidField(descriptionLength)
  description: string;
}

export interface ICreatePostCommand extends CreatePostInputModel {
  userId: string;
  image: FileMetadata;
}

export interface ICreatePostDTOModel extends CreatePostInputModel {
  userId: string;
}
