type ImageUrlsType = {
  urlOriginal: string;
  urlSmall?: string;
  urlLarge?: string;
};
export interface BaseImageResponse {
  urls: ImageUrlsType;
  imageMetaId: string;
}
