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
} 
export type FollowingView = {
  id: string;
  followingId: string;
  createdAt: Date;
}

export type SubViewModel = {
  id: string;
  followingId: string;
  followerId: string;
  createdAt: Date;
};
