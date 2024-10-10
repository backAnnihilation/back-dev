import { add } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

import { UserRecoveryType } from '../../api/models/auth.output.models/auth.output.models';

export const createRecoveryCode = (): UserRecoveryType => ({
  recoveryCode: uuidv4(),
  expirationDate: add(new Date(), { minutes: 45 }),
});
