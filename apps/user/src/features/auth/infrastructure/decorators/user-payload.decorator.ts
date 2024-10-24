import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserPayload = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    const { userId, deviceId } = request?.user;

    if (!userId && !deviceId) throw new Error('Should be used Guard!');

    return {
      userId,
      deviceId,
    };
  },
);
