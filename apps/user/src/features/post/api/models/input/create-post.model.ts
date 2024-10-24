import { descriptionLength, FileMetadata, iSValidField } from '@app/shared';
import { IsOptional } from 'class-validator';

export class CreatePostInputModel {
  @IsOptional()
  @iSValidField(descriptionLength)
  description?: string;
}

export interface ICreatePostCommand extends CreatePostInputModel {
  userId: string;
  image: FileMetadata;
}

export interface ICreatePostDTOModel extends CreatePostInputModel {
  userId: string;
}
