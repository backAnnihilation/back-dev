import { IsNotEmpty, Length } from 'class-validator';
import { FileMetadata } from '@app/shared';

export class CreatePostInputModel {
  @IsNotEmpty()
  @Length(0, 500)
  description: string;
}

export interface ICreatePostCommand extends CreatePostInputModel {
  userId: string;
  image: FileMetadata;
}

export interface ICreatePostDTOModel extends CreatePostInputModel {
  userId: string;
  imageUrl: string;
  imageId: string;
}
