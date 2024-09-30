import { UserProfile } from '@prisma/client';

export const getUserProfileViewModel = (
  profile: UserProfile,
): UserProfileViewModel => ({
  id: profile.id,
  userName: profile.userName,
  firstName: profile.firstName,
  lastName: profile.lastName,
  birthDate: profile.birthDate.toISOString(),
  createdAt: profile.createdAt.toISOString(),
  location: {
    country: profile.country,
    city: profile.city,
  },
  about: profile.about,
});

export type UserProfileViewModel = {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  createdAt: string;
  location: LocationViewModel;
  about?: string | null;
};

export type LocationViewModel = {
  country: string | null;
  city: string | null;
};

export type FollowersViewModel = {
  followers: number;
  following: number;
};

export const getUserProfileWithSubsViewModel = (
  profile: UserProfileViewModel,
  subs: FollowersViewModel,
): UserProfileWithSubsViewModel => ({
  ...profile,
  followers: subs.followers,
  following: subs.following,
});

export type UserProfileWithSubsViewModel = {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  createdAt: string;
  location: LocationViewModel;
  about?: string | null;
  followers: number;
  following: number;
};
