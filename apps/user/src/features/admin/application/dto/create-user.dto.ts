import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';

export class UserModelDTO {
  confirmationCode: string;
  confirmationExpDate: Date;
  isConfirmed: boolean;
  constructor(
    public userName: string,
    public email: string,
    public passwordHash: string,
    isConfirmed = false,
  ) {
    this.confirmationCode = uuidv4();
    this.confirmationExpDate = add(new Date(), {
      hours: 1,
      minutes: 15,
    });
    this.isConfirmed = isConfirmed;
  }
}
