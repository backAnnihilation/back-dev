export type ViewFollowerModel = {
  followerId: string;
};

export type ViewFollowingModel = {
  followingId: string;
};

export type ViewSubsModels = ViewFollowerModel & ViewFollowingModel;

export type ViewSubsCount = {
  followersCount: number;
  followingCount: number;
};

export type ViewSubs = {
  followers: string[];
  following: string[];
};

export type SubViewModel = {
  id: string;
  followingId: string;
  followerId: string;
  createdAt: Date;
};
