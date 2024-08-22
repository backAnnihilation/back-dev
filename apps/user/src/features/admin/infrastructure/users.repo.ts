import { Injectable } from '@nestjs/common';
import { UserIdType } from '../api/models/outputSA.models.ts/user-models';
import { PrismaService } from '../../../../core/db/prisma/prisma.service';
import { Prisma, UserAccount } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

@Injectable()
export class UsersRepository {
  private readonly userAccounts: Prisma.UserAccountDelegate<DefaultArgs>;
  constructor(private prisma: PrismaService) {
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

  // async saveRestrictionUserInfo(
  //   restrictionDto: UserBans,
  //   manager: EntityManager,
  // ) {
  //   try {
  //     return await manager.save(UserBans, restrictionDto);
  //   } catch (error) {
  //     throw new Error(`user restriction is not saved: ${error}`);
  //   }
  // }

  // async saveByEntity<T, D>(
  //   entity: EntityTarget<T>,
  //   data: D,
  //   manager: EntityManager,
  // ) {
  //   try {
  //     return await manager.save(entity, data);
  //   } catch (error) {
  //     throw new Error(`saveByEntity: ${error}`);
  //   }
  // }

  // async getUserById(userId: string): Promise<UserAccount | null> {
  //   try {
  //     return await this.userAccounts.findOneBy({ id: userId });
  //   } catch (error) {
  //     console.log(`error in getUserById: ${error}`);
  //     return null;
  //   }
  // }

  // async getUserWithBanInfo(
  //   userId: string,
  //   blogId: string,
  // ): Promise<UserAccount | boolean> {
  //   try {
  //     const userBanInfo = await this.userAccounts.findOne({
  //       where: { id: userId, bloggerBans: { blog: { id: blogId } } },
  //       relations: ['bloggerBans'],
  //     });
  //     const user = await this.userAccounts.findOneBy({ id: userId });

  //     if (!userBanInfo) return user;

  //     const { isBanned } = userBanInfo.bloggerBans[0];

  //     if (isBanned) return false;
  //     return user;
  //   } catch (error) {
  //     console.log(`error in getUserById: ${error}`);
  //     return false;
  //   }
  // }

  // // async getUserBanInfo(
  // //   userId: string,
  // //   manager: EntityManager,
  // // ): Promise<UserBans | null> {
  // //   try {
  // //     return await manager.findOneBy(UserBans, { user: { id: userId } });
  // //   } catch (error) {
  // //     console.log(`error in getUserBanInfo: ${error}`);
  // //     return null;
  // //   }
  // // }

  // async getEntityBanInfo<T>(
  //   entity: EntityTarget<T>,
  //   userId: string,
  //   manager: EntityManager,
  // ): Promise<T | null> {
  //   try {
  //     return await manager.findOne(entity, {
  //       where: { user: { id: userId } } as unknown as FindOptionsWhere<T>,
  //     });
  //   } catch (error) {
  //     console.log(`error in getEntityBanInfo: ${error}`);
  //     return null;
  //   }
  // }

  async deleteUser(userId: string): Promise<boolean> {
    try {
      // const result = await manager.delete(UserAccount, userId);
      const result = await this.userAccounts.delete({ where: { id: userId } });
      return !!result;
    } catch (error) {
      throw new Error(`error in deleteUser: ${error}`);
    }
  }
}
