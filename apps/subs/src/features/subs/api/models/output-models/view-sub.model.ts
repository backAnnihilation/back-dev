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
