export type ErrorsMessages = {
  message: string;
  field: string;
};

export type ErrorType = { errorsMessages: ErrorsMessages[] };

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

export type ErrorsMessagesTypes = keyof typeof ErrorField;

export const makeErrorsMessages = (invalidField: ErrorField): ErrorType => {
  const errorsMessages: Array<ErrorsMessages> = [];
  const doPush = Array.prototype.push.bind(errorsMessages);
  switch (invalidField) {
    case ErrorField.Email:
      doPush({
        message: `User with this ${invalidField} is already registered or doesn't exist`,
        field: `${invalidField}`,
      });
      break;
    case ErrorField.Code:
      doPush({
        message: `incorrect confirmation ${invalidField}, please check entered data or request again`,
        field: `${invalidField}`,
      });
      break;
    case ErrorField.Confirmation:
      doPush({
        message: `Email is already confirmed`,
        field: ErrorField.Confirmation,
      });
    case ErrorField.UserName:
      doPush({
        message: `Username is already confirmed`,
        field: ErrorField.UserName,
      });
    default:
      doPush({ message: `Invalid ${invalidField}`, field: `${invalidField}` });
      break;
  }

  return { errorsMessages };
};
