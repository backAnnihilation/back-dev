import { Post, PostImage, UserAccount, UserProfile } from '@prisma/client';
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
  post: Partial<Post> & { images: Partial<PostImage>[] } & {
    userAccount: { userProfile: Partial<UserProfile> };
  },
): PostViewModel => ({
  id: post.id,
  userName: post.userAccount.userProfile.userName,
  aboutMe: post.userAccount.userProfile.about,
  description: post.description,
  userId: post.userId,
  images: post.images.map(convertImagesToView),
  createdAt: post.createdAt.toISOString(),
});
