import { ImageSize } from '@app/shared';

type ImageSizeType = {
  type: ImageSize;
  width: number;
  height: number;
};

const sharedImageTypes = {
  ORIGINAL: { type: ImageSize.ORIGINAL, width: 0, height: 0 },
};

const postSizes = [
  sharedImageTypes.ORIGINAL,
  { type: ImageSize.SMALL, width: 50, height: 50 },
];

const profileSizes = [
  sharedImageTypes.ORIGINAL,
  { type: ImageSize.LARGE, width: 192, height: 95 },
  { type: ImageSize.SMALL, width: 45, height: 45 },
];

const imageSizes = {
  post: postSizes,
  profile: profileSizes,
};

export type ImageSizesType = ImageSizeType[];
export default imageSizes;
