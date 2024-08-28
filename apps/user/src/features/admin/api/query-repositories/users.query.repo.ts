import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { DatabaseService } from '../../../../../core/db/prisma/prisma.service';
import { getQueryPagination } from '../../../../../core/utils/query-pagination';
import { PaginationViewModel } from '../../../../../core/utils/sorting-base-filter';
import { SAQueryFilter } from '../models/outputSA.models.ts/query-filters';
import { getSAViewModel } from '../models/user.view.models/saView.model';
import { SAViewType } from '../models/user.view.models/userAdmin.view-type';

@Injectable()
export class UsersQueryRepo {
  private readonly userAccounts: Prisma.UserAccountDelegate<DefaultArgs>;
  constructor(private prisma: DatabaseService) {
    this.userAccounts = this.prisma.userAccount;
  }

  async getAllUsers(
    queryOptions: SAQueryFilter
  ): Promise<PaginationViewModel<SAViewType>> {
    const { searchEmailTerm, searchLoginTerm, banStatus } = queryOptions;

    const { pageNumber, pageSize, skip, sortBy, sortDirection } =
      getQueryPagination(queryOptions);

    const [login, email] = [
      `%${searchLoginTerm || ''}%`,
      `%${searchEmailTerm || ''}%`,
    ];

    // const queryBuilder = this.userAccounts
    //   .createQueryBuilder('user')
    //   .leftJoinAndSelect('user.userBan', 'ban')
    //   .where('(user.login ILIKE :login', { login })
    //   .orWhere('user.email ILIKE :email)', { email });

    // if (banStatus === BanStatus.banned) {
    //   queryBuilder.andWhere('(ban.isBanned = true)');
    // } else if (banStatus === BanStatus.notBanned) {
    //   queryBuilder.andWhere('(ban IS NULL OR ban.isBanned = false)');
    // }

    // queryBuilder
    //   .orderBy('user.' + sortBy, sortDirection)
    //   .skip(skip)
    //   .take(pageSize);

    // const [users, usersCount] = await queryBuilder.getManyAndCount();

    const users = await this.userAccounts.findMany();
    const usersCount = await this.userAccounts.count();

    return new PaginationViewModel<SAViewType>(
      users.map(getSAViewModel),
      pageNumber,
      pageSize,
      usersCount
    );
  }
  catch(error) {
    throw new InternalServerErrorException(
      'Database fails operate with find users by sorting model',
      error
    );
  }

  // async getBannedUsersForBlog(
  //   blogId: string,
  //   queryOptions: BloggerBannedUsersQueryFilter,
  // ): Promise<PaginationViewModel<BloggerBannedUsersViewType>> {
  //   const { searchLoginTerm } = queryOptions;
  //   const { pageNumber, pageSize, skip, sortBy, sortDirection } =
  //     getQueryPagination(queryOptions);

  //   const [login] = [`%${searchLoginTerm || ''}%`];

  //   const queryBuilder = this.userAccounts.createQueryBuilder('user');

  //   queryBuilder
  //     .select('user.login', 'login')
  //     .addSelect('user.id', 'id')
  //     .where('user.login ILIKE :login', { login })
  //     .leftJoin('user.bloggerBans', 'bb')
  //     .addSelect('bb.banDate', 'banDate')
  //     .addSelect('bb.banReason', 'banReason')
  //     .andWhere(
  //       'user.id IN (SELECT "userId" FROM user_blogger_bans WHERE "isBanned" = true AND "blogId" = :blogId)',
  //       { blogId },
  //     )
  //     .orderBy('user.' + sortBy, sortDirection)
  //     .limit(pageSize)
  //     .offset(skip);

  //   try {
  //     const users = await queryBuilder.getRawMany();
  //     const usersCount = await queryBuilder.getCount();

  //     return new PaginationViewModel<BloggerBannedUsersViewType>(
  //       users.map(getBloggerBannedUsersView),
  //       pageNumber,
  //       pageSize,
  //       usersCount,
  //     );
  //   } catch (error) {
  //     console.error(`get blogger banned users: ${error}`);
  //   }
  // }

  async getById(id: string): Promise<SAViewType | null> {
    try {
      const result = await this.userAccounts.findUnique({
        where: { id },
      });

      return getSAViewModel(result);
    } catch (error) {
      console.error('Database fails operate with find user', error);
      return null;
    }
  }
}
