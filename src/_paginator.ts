export type PaginatedOptions<T> = {
  data: T[];
  page: number;
};

export type PaginateOptions<T> = {
  data: T[];
  page: number;
  totalRecords: number;
};

export type PaginatedData<T> = {
  currentPage: number;
  data: T[];
  limit: number;
  nextPage: null | number;
  previousPage: null | number;
  totalPages: number;
  totalRecords: number;
};

export class Paginator {
  private _maxLimit: number;
  private _limit: number;

  constructor(maxLimit: number, limit = 10) {
    this._maxLimit = maxLimit;
    this._limit = limit;
  }

  get limit() {
    return this._limit;
  }

  private _getPaginatedData<T>({
    data,
    page,
    totalRecords,
  }: PaginateOptions<T>): PaginatedData<T> {
    page = Number(page);

    if (page < 1 || isNaN(page)) page = 1;

    const paginated: PaginatedData<T> = {
      currentPage: page,
      data: [],
      limit: this._limit,
      nextPage: null,
      previousPage: null,
      totalPages: Math.ceil(totalRecords / this.limit),
      totalRecords,
    };

    const startIndex = this.getOffset(page),
      stopIndex = this.getEndIndex(page);

    if (startIndex > totalRecords) {
      const previousPageNumber = page - 1;
      const prevStartIndex = this.getOffset(previousPageNumber);

      if (prevStartIndex <= totalRecords)
        paginated.previousPage = previousPageNumber;

      return paginated;
    }

    paginated.data = data;

    if (startIndex > 0) paginated.previousPage = page - 1;

    if (stopIndex < totalRecords) paginated.nextPage = page + 1;

    if (data.length > stopIndex - startIndex)
      paginated.data = data.slice(startIndex, stopIndex);

    return paginated;
  }

  getEndIndex = (page: number) => page * this._limit;

  /**
   * To the index of the first item of a page in the entire array. Look at it like the number of items skipped to get to the first item on the specified page
   *
   * Could also be called getStartIndex
   * @param page the current page
   */
  getOffset(page: number) {
    return !this._limit || !page ? 0 : (page - 1) * this._limit;
  }

  seLimit(limit: number) {
    limit = Number(limit);

    if (limit <= this._maxLimit || isNaN(limit)) this._limit = limit;

    return this;
  }

  getPaginatedData<T>({ data, page }: PaginatedOptions<T>) {
    return this._getPaginatedData({ data, totalRecords: data.length, page });
  }

  paginate<T>({ data, totalRecords, page }: PaginateOptions<T>) {
    if (!totalRecords || totalRecords < data.length) totalRecords = data.length;

    return this._getPaginatedData({ data, page, totalRecords });
  }
}
