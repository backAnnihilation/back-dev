import { IsNotEmpty, IsString } from 'class-validator';
import { BaseImageDto } from './base-image.model';

export class InputPostImageDto extends BaseImageDto {
  @IsString()
  @IsNotEmpty()
  postId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
