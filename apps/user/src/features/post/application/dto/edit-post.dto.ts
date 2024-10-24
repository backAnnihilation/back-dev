import { IEditPostCommand } from '../../api/models/input/edit-post.model';

export class EditUserPostDTO {
  readonly description: string;
  readonly postId: string;
  readonly userId: string;

  constructor(profileDto: IEditPostCommand) {
    const { description, postId, userId } = profileDto;
    this.description = description;
    this.postId = postId;
    this.userId = userId;
  }
}
