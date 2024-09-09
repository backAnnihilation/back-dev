import { Injectable } from '@nestjs/common';
import { getSessionViewModel } from '../models/security.view.models/security.view.model';
import { SecurityViewDeviceModel } from '../models/security.view.models/security.view.types';
import { DatabaseService } from '../../../../../core/db/prisma/prisma.service';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { Prisma } from '@prisma/client';

@Injectable()
export class SecurityQueryRepo {
  private userSessions: Prisma.UserSessionDelegate<DefaultArgs>;
  constructor(private prisma: DatabaseService) {
    this.userSessions = this.prisma.userSession;
  }

  async getUserActiveSessions(
    userId: string,
  ): Promise<SecurityViewDeviceModel[] | null> {
    try {
      const sessions = await this.userSessions.findMany({ where: { userId } });
      return sessions.map(getSessionViewModel);
    } catch (error) {
      console.log(`Database fails operate with find user sessions ${error}`);
      throw new Error('Database fails operate with find user sessions');
    }
  }

  async getUserSession(
    deviceId: string,
  ): Promise<SecurityViewDeviceModel | null> {
    try {
      const sessions = await this.userSessions.findUnique({
        where: {
          deviceId,
        },
      });

      if (!sessions) return null;

      return getSessionViewModel(sessions);
    } catch (error) {
      console.log(`Database fails operate with find user session ${error}`);
      return null;
    }
  }
}
