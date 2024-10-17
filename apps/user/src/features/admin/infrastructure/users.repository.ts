import { Injectable } from '@nestjs/common';
import { Prisma, UserAccount } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { BaseRepository, DatabaseService } from '@user/core';

@Injectable()
export class UsersRepository extends BaseRepository<
  Prisma.UserAccountDelegate<DefaultArgs>,
  Prisma.UserAccountCreateInput,
  UserAccount
> {
  constructor(protected prisma: DatabaseService) {
    super(prisma.userAccount);
  }

  async save(userDto: Prisma.UserAccountCreateInput): Promise<UserAccount> {
    try {
      return await this.prismaModel.create({ data: userDto });
    } catch (error) {
      console.log(error);
      throw new Error(`user is not saved: ${error}`);
    }
  }

  async getUserById(id: string): Promise<UserAccount | null> {
    try {
      return await this.prismaModel.findUnique({ where: { id } });
    } catch (error) {
      console.log(`error in getUserById: ${error}`);
      return null;
    }
  }

  async getUserByNameOrEmail(name: string, email: string) {
    try {
      return await this.prismaModel.findFirst({
        where: { OR: [{ email }, { userName: name }] },
      });
    } catch (error) {
      return null;
    }
  }

  async deleteUser(id: string): Promise<UserAccount> {
    try {
      return await this.prismaModel.delete({ where: { id } });
    } catch (error) {
      throw new Error(`error in deleteUser: ${error}`);
    }
  }
}
