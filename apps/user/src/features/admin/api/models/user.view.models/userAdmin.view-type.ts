export type SAViewType = {
  /**
   * id of the existing user
   */
  id: string;

  /**
   *  user's login
   */
  userName: string;

  /**
   * user's email
   */
  email: string;

  /**
   * user creation date
   */
  createdAt: string | Date;
};
