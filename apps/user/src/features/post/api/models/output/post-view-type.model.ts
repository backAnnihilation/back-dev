import { PhotoType } from '@user/core';

export type PostViewModel = {
  id: string;
  userName: string;
  aboutMe: string;
  description: string;
  userId: string;
  images: PhotoType[];
};
