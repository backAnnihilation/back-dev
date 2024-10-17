type ErrorsMessages = {
  message: string;
  field: string;
};

type ErrorType = { errorsMessages: ErrorsMessages[] };

export enum ErrorField {
  Email = 'email',
  Code = 'code',
  Confirmation = 'confirmation',
  UserName = 'userName',
  Title = 'title',
  Name = 'name',
  Login = 'login',
  ShortDescription = 'shortDescription',
  Description = 'description',
  BlogId = 'blogId',
  Content = 'content',
  PostId = 'postId',
  LoginOrEmail = 'loginOrEmail',
  WebsiteUrl = 'websiteUrl',
  Password = 'password',
}

export const constructErrorMessages = (
  fields: ErrorField[],
  message?: string,
): ErrorType => {
  const errorsMessages: ErrorsMessages[] = [];
  for (const field of fields) {
    errorsMessages.push({
      message: message ?? expect.any(String),
      field: field ?? expect.any(String),
    });
  }
  return { errorsMessages };
};
