import { Injectable } from '@nestjs/common';
import {
  UpdateConfirmationCodeDto,
  UserRecoveryType,
} from '../api/models/auth.output.models/auth.output.models';
import { EmailDtoType } from '../api/models/auth.output.models/auth.user.types';
import { CreateTempAccountDto } from '../api/models/temp-account.models.ts/temp-account-models';
import { UpdatePasswordDto } from '../api/models/auth-input.models.ts/password-recovery.types';
import { OutputId } from '../../../../core/api/dto/output-id.dto';
import { Prisma, UserAccount } from '@prisma/client';
import { DatabaseService } from '../../../../core/db/prisma/prisma.service';
import { DefaultArgs } from '@prisma/client/runtime/library';

type BanInfoType = {
  isBanned: boolean;
};

@Injectable()
export class AuthRepository {
  private userAccounts: Prisma.UserAccountDelegate<DefaultArgs>;
  private userBans: any;
  constructor(private readonly prisma: DatabaseService) {
    this.userAccounts = this.prisma.userAccount;
  }

  async getUserBanInfo(userId: string): Promise<BanInfoType> {
    try {
      const result = await this.userBans.findOne({
        where: { user: { id: userId } },
      });

      if (!result) return null;

      return { isBanned: result.isBanned };
    } catch (error) {}
  }

  async findUserAccountByConfirmationCode(
    confirmationCode: string
  ): Promise<UserAccount | null> {
    try {
      const result = await this.userAccounts.findFirst({
        where: { confirmationCode },
      });

      if (!result) return null;

      return result;
    } catch (e) {
      console.error(
        `there were some problems during find user's account by confirmation code, ${e}`
      );
      return null;
    }
  }
  async findConfirmedUserByEmailOrName({
    userName,
    email,
  }): Promise<UserAccount | null> {
    try {
      return await this.userAccounts.findFirst({
        where: { OR: [{ email }, { userName }], AND: { isConfirmed: true } },
      });
    } catch (error) {
      console.log(`findByEmailOrName: ${error}`);
      return null;
    }
  }
  async findExistedUserByEmailOrName({
    userName,
    email,
  }): Promise<UserAccount | null> {
    try {
      return await this.userAccounts.findFirst({
        where: { OR: [{ email }, { userName }] },
      });
    } catch (error) {
      console.log(`findByEmailOrName: ${error}`);
      return null;
    }
  }

  async findUserByEmail(email: string): Promise<UserAccount | null> {
    try {
      const result = await this.userAccounts.findUnique({ where: { email } });

      if (!result) return null;

      return result;
    } catch (e) {
      console.error(`there were some problems during find user by email, ${e}`);
      return null;
    }
  }
  async findUserByRecoveryCode(code: string): Promise<UserAccount | null> {
    try {
      return await this.userAccounts.findFirst({
        where: {
          AND: [
            { passwordRecoveryCode: code },
            { passwordRecoveryExpDate: { gte: new Date() } },
          ],
        },
      });
    } catch (e) {
      console.error(
        `there were some problems during find user by recovery code, ${e}`
      );
      return null;
    }
  }

  async updateConfirmation(id: string): Promise<boolean> {
    try {
      const result = await this.userAccounts.update({
        where: { id },
        data: { isConfirmed: true },
      });

      return !!result;
    } catch (error) {
      console.error(
        `there were some problems during update user's confirmation code: ${error}`
      );
      return false;
    }
  }

  async updateConfirmationCode(
    confirmationData: UpdateConfirmationCodeDto
  ): Promise<boolean> {
    try {
      const { id, expirationDate, recoveryCode } = confirmationData;

      const result = await this.userAccounts.update({
        where: { id },
        data: {
          confirmationCode: recoveryCode,
          confirmationExpDate: expirationDate,
        },
      });

      return !!result;
    } catch (error) {
      console.error(
        `Database fails operate during update confirmation code operation ${error}`
      );
      return false;
    }
  }

  async updateRecoveryCode(
    email: string,
    recoveryData: UserRecoveryType
  ): Promise<void> {
    try {
      await this.userAccounts.update({
        where: { email },
        data: {
          passwordRecoveryCode: recoveryData.recoveryCode,
          passwordRecoveryExpDate: recoveryData.expirationDate,
        },
      });
    } catch (error) {
      console.error(
        `Database fails operate during update recovery code operation ${error}`
      );
      throw new Error(error);
    }
  }

  async updateUserPassword(updateData: UpdatePasswordDto): Promise<void> {
    try {
      const { passwordHash, userId } = updateData;

      await this.userAccounts.update({
        where: { id: userId },
        data: {
          passwordHash,
          passwordRecoveryCode: null,
          passwordRecoveryExpDate: null,
        },
      });
    } catch (error) {
      console.error(
        `Database fails operate with update user password ${error}`
      );
      throw new Error(error);
    }
  }
}
