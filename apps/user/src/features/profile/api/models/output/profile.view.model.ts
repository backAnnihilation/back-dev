import { ProfileImage, UserProfile } from '@prisma/client';
import { PhotoType } from '@user/core';

const convertImagesToView = (image: ProfileImage) => ({
  id: image.id,
  urls: {
    urlOriginal: image.urlOriginal || null,
    urlSmall: image.urlSmall || null,
    urlLarge: image.urlLarge || null,
  },
  createdAt: image.createdAt.toISOString(),
});

export const getUserProfileViewModel = (
  profile: UserProfile & { images: ProfileImage[] },
): UserProfileViewModel => ({
  id: profile.id,
  userName: profile.userName,
  firstName: profile.firstName,
  lastName: profile.lastName,
  birthDate: profile.birthDate.toISOString(),
  about: profile.about,
  location: {
    country: profile.country,
    city: profile.city,
  },
  createdAt: profile.createdAt.toISOString(),
  mainImage: convertImagesToView(profile.images[0]) || null,
});

export type UserProfileViewModel = {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  location: LocationViewModel;
  about?: string | null;
  createdAt: string;
  mainImage?: PhotoType | null;
};
export type LocationViewModel = {
  country: string | null;
  city: string | null;
};
