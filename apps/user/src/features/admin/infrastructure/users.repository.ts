import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { UserAccount } from '@prisma/client';
import { BaseRepository, PrismaService } from '@user/core';

@Injectable()
export class UsersRepository extends BaseRepository<UserAccount> {
  constructor(
    protected prisma: PrismaService,
    txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {
    super(prisma, 'userAccount', txHost);
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
