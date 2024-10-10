import { Post } from '@prisma/client';
import { PostViewModel } from './post.view.model';

export const getPostViewModel = (post: Post): PostViewModel => ({
  id: post.id,
  description: post.description,
  userId: post.userId,
  image: post.imageUrl,
});
