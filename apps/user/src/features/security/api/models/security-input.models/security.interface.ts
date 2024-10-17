import { SecurityViewDeviceModel } from '../security.view.models/security.view.types';

import { UserSessionDto } from './security-session-info.model';

export interface SecurityInterface {
  getUserActiveSessions(
    userInfo: UserSessionDto,
  ): Promise<SecurityViewDeviceModel[]>;
  terminateOtherUserSessions(userInfo: UserSessionDto): Promise<void>;
  deleteSession(deviceId: string, userInfo: UserSessionDto): Promise<void>;
}
