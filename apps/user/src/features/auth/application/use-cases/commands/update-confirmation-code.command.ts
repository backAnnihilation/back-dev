import { InputEmailDto } from '../../../api/models/auth-input.models.ts/password-recovery.types';

export class UpdateConfirmationCodeCommand {
  constructor(public updateDto: InputEmailDto) {}
}
