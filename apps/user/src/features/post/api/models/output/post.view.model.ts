import { Post, PostImage, UserProfile } from '@prisma/client';
import { PostViewModel } from './post-view-type.model';

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
  post: Post & { about: string; userName: string; images?: PostImage[] },
): PostViewModel => ({
  id: post.id,
  userName: post.userName,
  aboutMe: post.about,
  description: post.description,
  userId: post.userId,
  images: post.images.map(convertImagesToView),
});
