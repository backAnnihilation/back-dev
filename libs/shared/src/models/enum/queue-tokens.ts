export enum QUEUE_TOKEN {
  FILES_SERVICE = 'FILES_SERVICE',
  NOTICE_SERVICE = 'NOTICE_SERVICE',
}
export enum QUEUE_NAME {
  FILES = 'RMQ_FILES_QUEUE',
  NOTICE = 'RMQ_NOTICE_QUEUE',
  USER = 'RMQ_USERS_QUEUE',
  EVENTS = 'RMQ_EVENTS_QUEUE',
}
export const USERS_QUEUE = QUEUE_NAME.USER;
export const FILES_QUEUE = QUEUE_NAME.FILES;
export const EVENTS_QUEUE = QUEUE_NAME.EVENTS;

export enum SERVICE_TOKEN {
  FILES = 'FILES_SERVICE',
  TCP_FILES = 'TCP_FILES_SERVICE',
  USERS = 'USERS_SERVICE',
  NOTICE = 'NOTICE_SERVICE',
  EVENTS = 'EVENTS_SERVICE'
}

export const TCP_FILES_SERVICE = SERVICE_TOKEN.TCP_FILES;

export const FILES_SERVICE = SERVICE_TOKEN.FILES;
export const USERS_SERVICE = SERVICE_TOKEN.USERS;
export const EVENTS_SERVICE = SERVICE_TOKEN.EVENTS

export enum EVENT_NAME {
  FILE_UPLOAD = 'upload_file',
  PROFILE_IMAGE_UPLOAD = 'upload_profile_image',
  POST_CREATED = 'upload_post_image',
}
export const enum EVENT_COMMANDS {
  PROFILE_IMAGE_COMPLETED = 'profile_images_completed',
  FILE_UPLOAD = 'FILE_UPLOAD',
  PROFILE_IMAGE_UPLOAD = 'upload_profile_image',
  POST_CREATED = 'upload_post_image',
  IMAGES_DELIVERED = 'images_delivered',
  OUTBOX_FILE = 'outbox_file',
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
export const IMAGES_COMPLETED = EVENT_COMMANDS.PROFILE_IMAGE_COMPLETED;
export const IMAGES_DELIVERED = EVENT_COMMANDS.PROFILE_IMAGE_COMPLETED;
export const OUTBOX_FILE = EVENT_COMMANDS.OUTBOX_FILE;
