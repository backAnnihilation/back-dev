export enum QUEUE_TOKEN {
  FILES_SERVICE = 'FILES_SERVICE',
  NOTICE_SERVICE = 'NOTICE_SERVICE',
}
export enum QUEUE_NAME {
  FILES = 'FILES',
  NOTICE = 'NOTICE',
}

export enum SERVICE_TOKEN {
  FILES = 'FILES_SERVICE',
}

export const FILES_SERVICE = QUEUE_NAME.FILES;

export enum EVENT_NAME {
  FILE_UPLOAD = 'upload_file',
  PROFILE_IMAGE_UPLOAD = 'upload_profile_image',
  POST_CREATED = 'upload_post_image',
}
export const enum EVENT_COMMANDS {
  FILE_UPLOAD = 'FILE_UPLOAD',
  PROFILE_IMAGE_UPLOAD = 'upload_profile_image',
  POST_CREATED = 'upload_post_image',
}

export type CommandMap = {
  [key in EVENT_COMMANDS]: { cmd: EVENT_NAME };
};

// export const EVENT_CMD: CommandMap = {
//   [EVENT_COMMANDS.FILE_UPLOAD]: { cmd: EVENT_NAME.FILE_UPLOAD },
//   [EVENT_COMMANDS.PHOTO_UPLOAD]: { cmd: EVENT_NAME.PHOTO_UPLOAD },
// };

// export const UPLOAD_PHOTO = EVENT_CMD[EVENT_COMMANDS.PHOTO_UPLOAD];
// export const UPLOAD_FILE = EVENT_CMD[EVENT_COMMANDS.FILE_UPLOAD];

export const POST_CREATED = EVENT_COMMANDS.POST_CREATED;
export const PROFILE_IMAGE = EVENT_COMMANDS.PROFILE_IMAGE_UPLOAD;
