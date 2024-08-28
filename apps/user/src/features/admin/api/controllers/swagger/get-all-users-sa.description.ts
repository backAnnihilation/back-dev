import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiResponse,
  ApiProperty,
  ApiOperation,
  getSchemaPath,
  ApiExtraModels,
} from "@nestjs/swagger";
import { BasicAuthApi } from "./shared/authorization.response";

// DTO для представления пользователя
class SAViewDto {
  @ApiProperty({
    required: true,
    example: 'string'
  })
  id: string;

  @ApiProperty({
    required: true,
    example: 'example@mail.com'
  })
  email: string;

  @ApiProperty({
    required: true,
    example: 'Batman',
  })
  userName: string;

  @ApiProperty({
    required: true,
    type: String, // Изменено на String для корректного отображения в Swagger
    format: 'date-time',
  })
  createdAt: string | Date;
}

// Модель для представления устройства с массивом пользователей
export class SecurityViewDeviceModel {
  @ApiProperty({ description: 'Total number of pages' })
  pagesCount: number;

  @ApiProperty({ description: 'Current page number' })
  page: number;

  @ApiProperty({ description: 'Number of items per page' })
  pageSize: number;

  @ApiProperty({ description: 'Total number of items' })
  totalCount: number;

  @ApiProperty({
    description: 'Array of all users',
    type: 'array',
    items: { $ref: getSchemaPath(SAViewDto) }
  })
  items: SAViewDto[];
}

export const GetAllUsersEndpoint = () =>
  applyDecorators(
    ApiExtraModels(SAViewDto), // Добавляем здесь регистрацию модели
    ApiOperation({
      summary: 'Get all users',
      description: 'Get all users. Super-admin API',
    }),
    ApiResponse({ status: HttpStatus.OK, type: SecurityViewDeviceModel }),
    BasicAuthApi(),
  );
