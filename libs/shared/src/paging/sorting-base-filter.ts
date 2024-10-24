import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum SortDirections {
  ASC = 'ASC',
  DESC = 'DESC',
  asc = 'asc',
  desc = 'desc',
}

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export abstract class BaseFilter {
  @IsOptional()
  @IsString()
  sortBy: string;

  @IsOptional()
  @IsEnum(SortDirections)
  abstract sortDirection: SortDirections;

  @IsOptional()
  @IsString()
  abstract pageSize: string;

  @IsOptional()
  @IsString()
  abstract pageNumber: string;
}
