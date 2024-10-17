import { SubStatus, UserProfile } from '@prisma/client';
import { SubViewModel } from './view-sub-types.model';

type InputUserProfile = Pick<
  UserProfile,
  'id' | 'userName' | 'followerCount' | 'followingCount'
> & {
  images: { urlOriginal: string }[];
};

type Follow = {
  userProfile: InputUserProfile;
};

export interface SubPayload {
  id: string;
  status: SubStatus;
  followerId: string;
  followingId: string;
  follower: Follow;
  following: Follow;
  createdAt: Date;
}

export const mapSubToView = (sub: SubPayload): SubViewModel => ({
  id: sub.id,
  status: sub.status,
  followerId: sub.followerId,
  followingId: sub.followingId,
  follower: {
    profileId: sub.follower.userProfile.id,
    profileName: sub.follower.userProfile.userName,
    imageUrl: sub.follower.userProfile.images[0]?.urlOriginal || null,
  },
  following: {
    profileId: sub.following.userProfile.id,
    profileName: sub.following.userProfile.userName,
    imageUrl: sub.following.userProfile.images[0]?.urlOriginal || null,
    followerCount: sub.following.userProfile.followerCount,
    followingCount: sub.following.userProfile.followingCount,
  },
  followerCount: sub.follower.userProfile.followerCount,
  followingCount: sub.follower.userProfile.followingCount,
  createdAt: sub.createdAt.toISOString(),
});
