import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserOauthProvider = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    const { user } = request;

    if (!user) throw new Error('Should be used OauthGuard!');

    return user;
  },
);
