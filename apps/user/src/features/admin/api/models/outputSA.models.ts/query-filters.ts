import { IsEnum, IsOptional } from 'class-validator';
import { BaseFilter } from '../../../../../../../../libs/shared/sorting-base-filter';

export enum BanStatus {
  all = 'all',
  banned = 'banned',
  notBanned = 'notBanned',
}

// todo ValidSortDirection and ValidateSortBy
export class SAQueryFilter extends BaseFilter {
  pageNumber: string;
  pageSize: string;

  @IsOptional()
  // @ValidateSortBy('sa')
  sortBy: string;

  // @ValidSortDirection()
  sortDirection: any;

  searchEmailTerm: string;
  searchNameTerm: string;

  @IsOptional()
  @IsEnum(BanStatus)
  banStatus: BanStatus;
}
