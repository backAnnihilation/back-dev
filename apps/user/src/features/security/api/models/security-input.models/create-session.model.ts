import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
import { ClientInfo } from '../../../../auth/api/models/auth-input.models.ts/client-info.type';

export class SessionCreationDto {
  @IsObject()
  @IsOptional()
  clientInfo?: ClientInfo;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
