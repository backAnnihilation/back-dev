export type UploadFileOutputType = {
  url: string;
  id: string;
};


export type ContentType =
  | 'image/png'
  | 'image/jpeg'
  | 'image/jpg'
  | 'image/gif'
  | 'image/bmp'
  | 'image/webp'
  | 'application/pdf'
  | 'text/plain'
  | 'text/html'
  | 'application/json'
  | 'application/xml'
  | 'application/zip'
  | 'audio/mpeg'
  | 'audio/wav'
  | 'video/mp4'
  | 'video/mpeg';
