import { Post, PostImage } from '@prisma/client';
import { PostViewModel } from './post.view.model';

const convertImagesToView = (image: PostImage) => ({
  id: image.id,
  urls: {
    urlOriginal: image.urlOriginal || null,
    urlSmall: image.urlSmall || null,
    urlLarge: image.urlLarge || null,
  },
  createdAt: image.createdAt.toISOString(),
});
export const getPostViewModel = (
  post: Post & { image: PostImage },
): PostViewModel => ({
  id: post.id,
  description: post.description,
  userId: post.userId,
  image: convertImagesToView(post.image),
});
