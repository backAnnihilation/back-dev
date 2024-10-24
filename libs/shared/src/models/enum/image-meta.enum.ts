export type FileMetadata = Express.Multer.File;

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  FILE = 'file',
}

export enum ImageType {
  MAIN = 'main',
  WALLPAPER = 'wallpaper',
  BACKGROUND = 'background',
}

export enum ImageCategory {
  PROFILE = 'profile',
  POST = 'post',
  PRODUCT = 'product',
}


export enum ImageSize {
  ORIGINAL = 'original',
  LARGE = 'large',
  SMALL = 'small',
  MEDIUM = 'medium',
}