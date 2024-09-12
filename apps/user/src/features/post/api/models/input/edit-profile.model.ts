import { IsNotEmpty } from 'class-validator';

export class EditPostInputModel {

  @IsNotEmpty() 
  description: string;

  @IsNotEmpty() 
  postId: string;

}

export interface IEditPostCommand extends EditPostInputModel {
  userId: string;
  
}

