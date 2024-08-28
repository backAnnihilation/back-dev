import { UserSession } from '@prisma/client';
import { SecurityViewDeviceModel } from './security.view.types';

export const getSessionViewModel = (
  session: UserSession,
): SecurityViewDeviceModel => ({
  ip: session.ip || '127.0.0.1',
  title: session.userAgentInfo,
  lastActiveDate: session.rtExpirationDate.toISOString(),
  deviceId: session.deviceId,
});
