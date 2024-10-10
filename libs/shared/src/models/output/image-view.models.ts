interface IBaseImageType {
  id: string;
  url: string;
  createdAt: string;
}

export interface IProfileImageViewModelType extends IBaseImageType {
  profileId: string;
}

export interface IPostImageViewModelType extends IBaseImageType {
  postId: string;
}
