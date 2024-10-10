import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { BasicAuthApi } from '../../../../auth/api/swagger/shared/authorization.response';

export const DropDatabaseSaEndpoint = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Drop database',
      description:
        'Clear database completely. Delete all files. Super-admin API ',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Success - Database deleted',
    }),
    BasicAuthApi(),
  );
