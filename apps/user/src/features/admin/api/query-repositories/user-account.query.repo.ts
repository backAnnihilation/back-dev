import { PaginationViewModel } from '@app/shared';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '@user/core';
import { SAQueryFilter } from '../models/outputSA.models.ts/sa-query-filter';
import { getSAViewModel } from '../models/user.view.models/saView.model';
import { SAViewType } from '../models/user.view.models/userAdmin.view-type';

@Injectable()
export class UsersQueryRepo {
  private readonly userAccounts: Prisma.UserAccountDelegate;
  constructor(private prisma: DatabaseService) {
    this.userAccounts = this.prisma.userAccount;
  }

  async getAllUsers(
    queryOptions: SAQueryFilter,
  ): Promise<PaginationViewModel<SAViewType>> {
    const { searchEmailTerm, searchNameTerm } = queryOptions;

    const { pageNumber, pageSize, skip, sortBy, sortDirection } =
      PaginationViewModel.parseQuery(queryOptions);

    const [name, email] = [
      `%${searchNameTerm || ''}%`,
      `%${searchEmailTerm || ''}%`,
    ];

    try {
      const users = await this.userAccounts.findMany({
        where: {
          OR: [
            { userName: { contains: name, mode: 'insensitive' } },
            { email: { contains: email, mode: 'insensitive' } },
          ],
        },
        skip,
        take: pageSize,
        orderBy: { [sortBy]: sortDirection },
      });
      const usersCount = await this.userAccounts.count();

      return new PaginationViewModel<SAViewType>(
        users.map(getSAViewModel),
        pageNumber,
        pageSize,
        usersCount,
      );
    } catch (error) {
      console.error(`get all users: ${error}`);
    }
  }

  async getById(id: string): Promise<SAViewType | null> {
    try {
      const result = await this.userAccounts.findUnique({
        where: { id },
      });
      if (!result) return null;
      return getSAViewModel(result);
    } catch (error) {
      console.error('Database fails operate with find user', error);
      return null;
    }
  }
}
