import { ObjectType } from "./interfaces";

export interface PaginatorProps {
  limit: number;
  page: number;
}

export interface PaginateProps {
  count: number;
  data: any[];
}

export class Paginator {
  private _limit: number = 0;
  private _maxLimit: number;
  private _page: number = 0;

  constructor(maxLimit: number, { limit, page }: PaginatorProps) {
    this._maxLimit = maxLimit;

    this._limit = limit > this._maxLimit ? this._maxLimit : limit;
    this._page = page;
  }

  getEndIndex = () => this._page * this._limit;

  getStartIndex() {
    if (!this._limit || !this._page) return 0;

    return (this._page - 1) * this._limit;
  }

  paginate({ count, data }: PaginateProps) {
    const paginated: ObjectType = { data };

    const startIndex = this.getStartIndex(),
      stopIndex = this.getEndIndex();

    if (startIndex > 0)
      paginated.previous = { limit: this._limit, page: this._page - 1 };

    if (stopIndex < count)
      paginated.next = { limit: this._limit, page: this._page + 1 };

    if (data.length > stopIndex - startIndex)
      paginated.data = data.slice(startIndex, stopIndex);

    return paginated;
  }
}
