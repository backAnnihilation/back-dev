import { Injectable } from '@nestjs/common';
import { Prisma, UserAccount } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { BaseRepository } from '@user/core/db/base.repository';
import { DatabaseService } from '@user/core/db/prisma/prisma.service';

@Injectable()
export class UsersRepository extends BaseRepository {
  private readonly userAccounts: Prisma.UserAccountDelegate<DefaultArgs>;
  constructor(protected prisma: DatabaseService) {
    super(prisma);
    this.userAccounts = this.prisma.userAccount;
  }

  async save(userDto: Prisma.UserAccountCreateInput): Promise<UserAccount> {
    try {
      return await this.userAccounts.create({ data: userDto });
    } catch (error) {
      console.log(error);
      throw new Error(`user is not saved: ${error}`);
    }
  }

  async getUnconfirmedUserByEmailOrName(
    email: string,
    userName: string,
  ): Promise<UserAccount | null> {
    try {
      return await this.userAccounts.findFirst({
        where: { OR: [{ email }, { userName }], isConfirmed: false },
      });
    } catch (error) {
      console.log(`error in getUserByEmail: ${error}`);
      return null;
    }
  }

  async getUserById(id: string): Promise<UserAccount | null> {
    try {
      return await this.userAccounts.findUnique({ where: { id } });
    } catch (error) {
      console.log(`error in getUserById: ${error}`);
      return null;
    }
  }

  async getUserByNameOrEmail(name: string, email: string) {
    try {
      return await this.userAccounts.findFirst({
        where: { OR: [{ email }, { userName: name }] },
      });
    } catch (error) {
      return null;
    }
  }

  async deleteUser(userId: string): Promise<UserAccount> {
    try {
      return await this.userAccounts.delete({ where: { id: userId } });
    } catch (error) {
      throw new Error(`error in deleteUser: ${error}`);
    }
  }
}
