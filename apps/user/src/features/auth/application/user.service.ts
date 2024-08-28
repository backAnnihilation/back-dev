import { Injectable } from '@nestjs/common';
import {
  GetErrors,
  LayerNoticeInterceptor,
} from '../../../../core/utils/notification';
import { UserAccount } from '@prisma/client';

export const userValidationOptions = {
  isConfirmed: true,
  isExpired: true,
};

@Injectable()
export class UserService {
  private location = this.constructor.name;
  constructor() {}

  validateUserAccount = (validateDto: ValidationFieldsType) => {
    const { userAccount, ...restOptions } = validateDto;

    const notice = new LayerNoticeInterceptor();

    if (!userAccount) {
      notice.addError(
        'user account was not found or code has been expired',
        this.location,
        GetErrors.NotFound,
      );
      return notice;
    }
    if (restOptions?.isConfirmed) {
      if (userAccount.isConfirmed) {
        notice.addError(
          'user account already confirmed',
          this.location,
          GetErrors.IncorrectModel,
        );
        return notice;
      }
    }
    if (restOptions?.isExpired) {
      const isValid = this.checkConfirmationRelevant(
        userAccount.confirmationExpDate,
      );

      if (!isValid) {
        notice.addError(
          'confirmation code has expired',
          this.location,
          GetErrors.IncorrectModel,
        );
        return notice;
      }
    }
    return notice;
  };

  private checkConfirmationRelevant = (confirmationExpDate: Date) => {
    const now = new Date().getTime();
    return now < confirmationExpDate.getTime();
  };
}

type ValidationFieldsType = {
  userAccount: UserAccount | null;
  isConfirmed?: boolean;
  isExpired?: boolean;
};
