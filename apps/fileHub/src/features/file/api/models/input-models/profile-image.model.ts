import { IsString } from 'class-validator';
import { BaseImageDto } from './base-image.model';

export class InputProfileImageDto extends BaseImageDto {
  @IsString()
  profileId: string;
}
