import { Injectable } from '@nestjs/common';
import { Prisma, UserAccount } from '@prisma/client';
import { BaseRepository, PrismaService } from '@user/core';

@Injectable()
export class UsersRepository extends BaseRepository<UserAccount> {
  constructor(protected prisma: PrismaService) {
    super(prisma, 'userAccount');
  }

  async save(userDto: Prisma.UserAccountCreateInput): Promise<UserAccount> {
    try {
      return await this.model.create({ data: userDto });
    } catch (error) {
      console.log(error);
      throw new Error(`user is not saved: ${error}`);
    }
  }

  async getUserById(id: string): Promise<UserAccount | null> {
    try {
      return await this.model.findUnique({ where: { id } });
    } catch (error) {
      console.log(`error in getUserById: ${error}`);
      return null;
    }
  }

  async getUserByNameOrEmail(name: string, email: string) {
    try {
      return await this.model.findFirst({
        where: { OR: [{ email }, { userName: name }] },
      });
    } catch (error) {
      return null;
    }
  }

  async deleteUser(id: string): Promise<UserAccount> {
    try {
      return await this.model.delete({ where: { id } });
    } catch (error) {
      throw new Error(`error in deleteUser: ${error}`);
    }
  }
}
