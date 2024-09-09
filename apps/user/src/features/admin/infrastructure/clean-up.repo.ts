import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { DatabaseService } from '../../../../core/db/prisma/prisma.service';

@Injectable()
export class CleanUpDatabaseRepository {
  private readonly userAccounts: Prisma.UserAccountDelegate<DefaultArgs>;
  private readonly userSessions: Prisma.UserSessionDelegate<DefaultArgs>;

  constructor(private prisma: DatabaseService) {
    this.userAccounts = this.prisma.userAccount;
    this.userSessions = this.prisma.userSession;
  }

  async clearDatabase(): Promise<any> {
    try {
      const usersCountBefore = await this.userAccounts.count()
      const usersSessionBefore = await this.userSessions.count()

      await this.userSessions.deleteMany({});

      await this.userAccounts.deleteMany({});

      const usersCountAfter = await this.userAccounts.count()
      const usersSessionAfter = await this.userSessions.count()

      return {
        usersSessionWasDeleted: usersSessionBefore - usersSessionAfter,
        usersAccountsWasDeleted: usersCountBefore - usersCountAfter
      }
    } catch (error) {
      throw new Error(`Error in clearDatabase: ${error}`);
    }
  }
}
