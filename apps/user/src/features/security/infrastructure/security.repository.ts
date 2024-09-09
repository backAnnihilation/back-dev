import { Injectable } from '@nestjs/common';
import { OutputId } from '../../../../../../libs/shared/models/output-id.dto';
import { DatabaseService } from '../../../../core/db/prisma/prisma.service';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { Prisma, UserSession } from '@prisma/client';
import { UserSessionDTO } from '../../auth/api/models/dtos/user-session.dto';
import { UserSessionDto } from '../api/models/security-input.models/security-session-info.model';

@Injectable()
export class SecurityRepository {
  private userSessions: Prisma.UserSessionDelegate<DefaultArgs>;
  constructor(private prisma: DatabaseService) {
    this.userSessions = this.prisma.userSession;
  }

  async createSession(sessionDto: UserSessionDTO): Promise<void> {
    try {
      await this.userSessions.create({
        data: sessionDto,
      });
    } catch (error) {
      console.error(`
      Database fails operate with create session ${error}`);
      throw new Error(`Database fails operate with create session ${error}`);
    }
  }

  async getSession(userId: string, deviceId: string): Promise<UserSession> {
    try {
      return await this.userSessions.findFirst({
        where: { AND: [{ userId }, { deviceId }] },
      });
    } catch (error) {
      console.error(`Database fails operate with get session ${error}`);
    }
  }

  async updateIssuedToken(
    deviceId: string,
    issuedAt: Date,
    exp: Date,
  ): Promise<void> {
    try {
      await this.userSessions.update({
        where: { deviceId },
        data: { rtIssuedAt: issuedAt, rtExpirationDate: exp },
      });
    } catch (error) {
      console.error(`updateIssuedToken`, error);
      throw new Error(error);
    }
  }

  async deleteSession(deviceId: string): Promise<void> {
    try {
      await this.userSessions.delete({ where: { deviceId } });
    } catch (error) {
      console.error(
        `Database operation failed while deleting session with deviceId ${deviceId}: ${error.message}`,
      );
      throw new Error(error);
    }
  }

  async deleteOtherUserSessions(userSessionDto: UserSessionDto): Promise<void> {
    const { userId, deviceId } = userSessionDto;

    try {
      await this.userSessions.deleteMany({
        where: { userId, NOT: { deviceId } },
      });
    } catch (error) {
      console.error(
        `Database fails operate with delete other sessions ${error}`,
      );
      throw new Error(error);
    }
  }

  async deleteActiveSessions(userId: string): Promise<void> {
    try {
      await this.userSessions.deleteMany({ where: { userId } });
    } catch (error) {
      console.error(
        `Database fails operate with delete active sessions ${error}`,
      );
      throw new Error(error);
    }
  }
}
