import { ICreatePostDTOModel } from '../../api/models/input/create-post.model';

export class CreatePostDTO {
  readonly description: string;
  readonly userId: string;

  constructor(profileDto: ICreatePostDTOModel) {
    const { description, userId } = profileDto;
    this.description = description ?? null;
    this.userId = userId;
  }
}
