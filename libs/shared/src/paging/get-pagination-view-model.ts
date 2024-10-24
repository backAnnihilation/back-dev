import {
  SortDirections,
  BaseFilter,
  SortDirection,
} from './sorting-base-filter';

type SortDirectionType = keyof typeof SortDirection;
export type PaginationType = {
  pageNumber: number;
  pageSize: number;
  skip: number;
  sortBy: string;
  sortDirection: SortDirectionType;
  sort?: string[];
};

const extractSortDirection = (inputDirection: SortDirections) =>
  inputDirection === SortDirections.ASC
    ? SortDirection.ASC
    : SortDirection.DESC;

export class PaginationViewModel<P> {
  public readonly pagesCount: number;
  public readonly page: number;
  public readonly pageSize: number;
  public readonly totalCount: number;
  public readonly items: P[];

  constructor(items: P[], page: number, pageSize: number, totalCount: number) {
    this.pagesCount = Math.ceil(totalCount / pageSize);
    this.page = page;
    this.pageSize = pageSize;
    this.totalCount = +totalCount || 0;

    this.items = items;
  }

  static parseQuery = <T extends BaseFilter>(query: T): PaginationType => {
    const baseSortedField = 'createdAt';

    const sortDirection = extractSortDirection(
      query.sortDirection,
    ).toLocaleLowerCase() as SortDirectionType;

    const sortBy = query?.sortBy || baseSortedField;

    const parsedPageNumber = parseInt(query.pageNumber, 10);
    const pageNumber = !isNaN(parsedPageNumber)
      ? Math.min(parsedPageNumber, 50)
      : 1;

    const parsedPageSize = parseInt(query.pageSize, 10);
    const pageSize = !isNaN(parsedPageSize) ? Math.min(parsedPageSize, 50) : 10;

    const skip = (pageNumber - 1) * pageSize;

    return {
      pageNumber,
      pageSize,
      skip,
      sortBy,
      sortDirection,
    };
  };
}
