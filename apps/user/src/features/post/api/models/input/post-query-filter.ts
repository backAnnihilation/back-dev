import { IsEnum, IsOptional } from 'class-validator';
import { BaseFilter, SortDirections } from '@app/shared';

// toDo validate input Query
export class PostsQueryFilter extends BaseFilter {
  pageNumber: string;
  pageSize: string;

  // @ValidateSortBy('posts')
  sortBy: string;

  // @ValidSortDirection()
  @IsEnum(SortDirections)
  sortDirection: SortDirections;

  @IsOptional()
  searchDescriptionTerm: string;
}
