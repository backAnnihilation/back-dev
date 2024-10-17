import { SubStatus } from '@prisma/client';

export type ViewFollowerModel = {
  followerId: string;
};

export type ViewFollowingModel = {
  followingId: string;
};

export type ViewSubsModels = ViewFollowerModel & ViewFollowingModel;

export type ViewSubsCount = {
  followerCount: number;
  followingCount: number;
};
export type FollowersView = {
  id: string;
  followerId: string;
  createdAt: Date;
};
export type FollowingView = {
  id: string;
  followingId: string;
  createdAt: Date;
};

type FollowInfo = {
  profileId: string;
  profileName: string;
  imageUrl?: string;
};
type Follower = FollowInfo;
type Following = FollowInfo & {
  followerCount: number;
  followingCount: number;
};

export type SubViewModel = {
  id: string;
  status: SubStatus;
  followerId: string;
  followingId: string;
  follower: Follower;
  following: Following;
  createdAt: string;
  followerCount: number;
  followingCount: number;
};
