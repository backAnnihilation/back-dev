export type FollowCountUpdate = {
  followerId: string;
  followingId: string;
  operation: FollowCountOperation;
};
export enum FollowCountOperation {
  INCREMENT = 1,
  DECREMENT = -1,
}
