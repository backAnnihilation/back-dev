import { IsNotEmpty, Length } from 'class-validator';

export class EditPostInputModel {
  @IsNotEmpty()
  @Length(0, 500)
  description: string;
}

export interface IEditPostCommand extends EditPostInputModel {
  userId: string;
  postId: string;
}
