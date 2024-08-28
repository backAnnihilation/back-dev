export type LoginCredentials = {
  loginOrEmail: string;
  password: string;
};

export type EmailDtoType = {
  email: string;
};

export type AuthUserType = {
  id?: string;
  userName: string;
  email: string;
  password?: string;
};
