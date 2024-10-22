export const contentLength = { min: 3, max: 1000 };
export const questionLength = { min: 10, max: 500 };
export const descriptionLength = { min: 1, max: 500 };
export const contentPostLength = { min: 20, max: 300 };
export const aboutLength = { min: 0, max: 200 };
export const urlLength = { min: 3, max: 100 };
export const frequentLength = { min: 3, max: 100 };
export const answerLength = { min: 1, max: 100 };
export const nameInitials = { min: 1, max: 50 };
export const blogIdLength = { min: 20, max: 40 };
export const titleLength = { min: 3, max: 30 };
export const userNameLength = { min: 6, max: 30 };
export const passwordLength = { min: 6, max: 20 };
export const nameLength = { min: 3, max: 15 };
export const loginLength = { min: 3, max: 10 };
export const nameInitialsMatch = /^[A-Za-zА-Яа-я\s]+$/;
export const textMatch =
  /^[0-9A-Za-zА-Яа-я,.\-!@#$%^&*()_+=\[\]{};:'"<>?/\|`\s]+$/;
export const stringMatch = /^[a-zA-Z0-9_-]*$/;
export const emailMatches = /^\s*[\w-\.]+@([\w-]+\.)+[\w-]{2,4}\s*$/;
export const urlMatching =
  /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;
export const passwordMatch =
  /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])[0-9A-Za-z!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]+$/;

export const passwordFailedMatchMessage =
  'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
