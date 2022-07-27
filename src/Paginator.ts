import { ILooseObject } from "./interfaces";

export interface PaginatorProps {
  limit: number;
  page: number;
}

export interface PaginateProps {
  count: number;
  data: any[];
}

export class Paginator {
  private limit: number = 0;
  private maxLimit: number;
  private page: number = 0;

  constructor(maxLimit: number, { limit, page }: PaginatorProps) {
    this.maxLimit = maxLimit;

    this.limit = limit > this.maxLimit ? this.maxLimit : limit;
    this.page = page;
  }

  getEndIndex = () => this.page * this.limit;

  getStartIndex() {
    if (!this.limit || !this.page) return 0;

    return (this.page - 1) * this.limit;
  }

  paginate({ count, data }: PaginateProps) {
    const paginated: ILooseObject = { data };

    const startIndex = this.getStartIndex(),
      stopIndex = this.getEndIndex();

    if (startIndex > 0) {
      paginated.previous = { limit: this.limit, page: this.page - 1 };
    }

    if (stopIndex < count) {
      paginated.next = { limit: this.limit, page: this.page + 1 };
    }

    if (data.length > stopIndex - startIndex) {
      paginated.data = data.slice(startIndex, stopIndex);
    }

    return paginated;
  }
}
