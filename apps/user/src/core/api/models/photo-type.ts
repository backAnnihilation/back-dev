export type PhotoType = {
  id: string;
  urls: {
    urlOriginal: string | null;
    urlSmall: string | null;
    urlLarge: string | null;
  };
  createdAt: string;
};
