import { IsNotEmpty } from 'class-validator';

export class DeletePostInputModel {
  @IsNotEmpty() 
  postId: string;
}

export interface IDeletePostCommand extends DeletePostInputModel {
  userId: string;
  
}

