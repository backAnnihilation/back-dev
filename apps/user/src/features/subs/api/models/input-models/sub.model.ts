import { IsNotEmpty, IsString } from 'class-validator';

export class InputSubscriptionDto {
  @IsString()
  @IsNotEmpty()
  followerId: string;

  @IsString()
  @IsNotEmpty()
  followingId: string;
}

export class InputUserIdDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}
