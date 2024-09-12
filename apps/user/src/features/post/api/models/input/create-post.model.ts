import { IsNotEmpty } from 'class-validator';

export class CreatePostInputModel {

  @IsNotEmpty() 
  description: string;

  // @IsNotEmpty() 
  // photos: string;

}

export interface ICreatePostCommand extends CreatePostInputModel {
  userId: string;
  
}

