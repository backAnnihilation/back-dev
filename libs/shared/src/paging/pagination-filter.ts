import { SortDirection } from './sorting-base-filter';

type QueryType = Record<string, string | string[]>;

export class PaginationFilter {
  public readonly pageNumber: number;
  public readonly pageSize: number;
  public readonly sortDirection: SortDirection | 1 | -1;
  public readonly sortBy: string;

  constructor(query: QueryType, sortProperties: string[] = []) {
    this.sortBy = this.getSortBy(query, sortProperties);
    this.sortDirection = this.getSortDirection(query);
    this.pageNumber = query.pageNumber ? Math.min(+query.pageNumber, 50) : 1;
    this.pageSize = query.pageSize ? Math.min(+query.pageSize, 50) : 10;
  }

  public getSortDirectionInNumericFormat(): number {
    return this.sortDirection === SortDirection.ASC ? 1 : -1;
  }

  public getSkipItemsCount() {
    return (this.pageNumber - 1) * this.pageSize;
  }

  public getSortDirection(query: QueryType) {
    return query.sortDirection === SortDirection.ASC ? 1 : -1;
  }

  public getSortBy(query: QueryType, sortProperties: string[]): string {
    let result = 'createdAt';

    const querySortBy = query.sortBy;

    if (Array.isArray(querySortBy)) {
      for (let i = 0; i < querySortBy.length; i++) {
        const param = querySortBy[i] + '';

        if (sortProperties.includes(param)) {
          result = param;
          break;
        }
      }
    } else {
      if (sortProperties.includes(querySortBy.toString())) {
        result = querySortBy.toString();
      }
    }

    return result;
  }
}
