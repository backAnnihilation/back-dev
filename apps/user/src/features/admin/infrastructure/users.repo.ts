import { Injectable } from '@nestjs/common';
import { UserIdType } from '../api/models/outputSA.models.ts/user-models';

@Injectable()
export class UsersRepository {
  constructor() {}

  async save(userDto: any): Promise<UserIdType | null> {
    try {
      return userDto;
    } catch (error) {
      console.log(error);
      return null;
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

  // async deleteUser(userId: string, manager: EntityManager): Promise<boolean> {
  //   try {
  //     const result = await manager.delete(UserAccount, userId);
  //     return result.affected !== 0;
  //   } catch (error) {
  //     throw new Error(`error in deleteUser: ${error}`);
  //   }
  // }
}
