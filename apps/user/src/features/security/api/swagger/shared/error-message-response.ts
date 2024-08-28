import { ApiProperty } from '@nestjs/swagger';

export class ErrorMessageDto {
  @ApiProperty({
    description: 'Error message',
    example: 'Invalid userName or password',
    nullable: true,
  })
  message: string;

  @ApiProperty({
    description: 'Field where the error occurred',
    example: 'email',
    nullable: true,
  })
  field: string;
}

export class ErrorResponseDto {
  @ApiProperty({
    description: 'If the inputModel has incorrect values',
    type: [ErrorMessageDto],
  })
  errorsMessages: ErrorMessageDto[];
}

export class SingUpErrorResponse {
  @ApiProperty({
    description:
      'If the inputModel has incorrect values (in particular if the user with the given email or userName already exists)',
    type: [ErrorMessageDto],
  })
  errorsMessages: ErrorMessageDto[];
}
