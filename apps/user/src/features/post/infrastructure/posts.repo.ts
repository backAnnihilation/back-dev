import { Injectable } from '@nestjs/common';
import { Prisma, UserAccount } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
// import { BaseRepository } from '../../../../core/db/base.repository';
// import { DatabaseService } from '../../../../core/db/prisma/prisma.service';
import { BaseRepository } from '@user/core/db/base.repository';
import { DatabaseService } from '@user/core/db/prisma/prisma.service';

@Injectable()
export class PostsRepository extends BaseRepository {
  private readonly userPosts: Prisma.UserAccountDelegate<DefaultArgs>;
  constructor(protected prisma: DatabaseService) {
    super(prisma);
    this.userPosts = this.prisma.userAccount;
  }

  async save(userDto: Prisma.UserAccountCreateInput): Promise<UserAccount> {
    try {
      return await this.userPosts.create({ data: userDto });
    } catch (error) {
      console.log(error);
      throw new Error(`user is not saved: ${error}`);
    }
  }

  async getPostById(id: string): Promise<UserAccount | null> {
    try {
      return await this.userPosts.findUnique({ where: { id } });
    } catch (error) {
      console.log(`error in getPostById: ${error}`);
      return null;
    }
  }

  async deletePost(userId: string): Promise<UserAccount> {
    try {
      return await this.userPosts.delete({ where: { id: userId } });
    } catch (error) {
      throw new Error(`error in deleteUser: ${error}`);
    }
  }
}
