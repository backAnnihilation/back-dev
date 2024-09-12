import { ICreatePostCommand } from '../../api/models/input/create-post.model';

export class CreateUserPostDTO {
  readonly description: string;
  readonly userId: string;

  constructor(
    profileDto: ICreatePostCommand & {  userId: string },
  ) {
    const { description, userId } = profileDto;
    this.description = description;
    this.userId = userId;
  }
}



