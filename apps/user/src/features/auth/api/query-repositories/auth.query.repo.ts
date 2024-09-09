import { Injectable } from '@nestjs/common';
import { EmailDtoType } from '../models/auth.output.models/auth.user.types';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../../../../../core/db/prisma/prisma.service';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { getUserAccountViewModel } from '../models/auth.output.models/auth.view.model';
import { UserAccountViewModel } from '../models/auth.output.models/auth.output.models';

@Injectable()
export class AuthQueryRepository {
  private userAccounts: Prisma.UserAccountDelegate<DefaultArgs>;
  constructor(private prisma: DatabaseService) {
    this.userAccounts = this.prisma.userAccount;
  }

  async findUserAccountByRecoveryCode(code: string) {
    return 'viewUserAccount';
  }

  async findUserByEmail(
    emailDto: EmailDtoType,
  ): Promise<UserAccountViewModel | null> {
    try {
      const result = await this.userAccounts.findUnique({
        where: { email: emailDto.email },
      });
      if (!result) return null;

      return getUserAccountViewModel(result);
    } catch (error) {
      console.log(`findUserByEmail: ${error}`);
      return null;
    }
  }

  async getById(id: string): Promise<UserAccountViewModel> {
    try {
      const result = await this.userAccounts.findFirst({ where: { id } });
      if (!result) return null;
      return getUserAccountViewModel(result);
    } catch (error) {
      console.log(`getById: ${error}`);
      return null;
    }
  }
}
