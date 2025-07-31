interface PaginatedData<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class PaginatedResource<T> {
  constructor(
    private data: PaginatedData<T>,
    private formatItem: (item: T) => any
  ) {}

  toArray() {
    return {
      data: this.data.data.map(item => this.formatItem(item)),
      pagination: {
        currentPage: this.data.pagination.page,
        perPage: this.data.pagination.limit,
        total: this.data.pagination.total,
        totalPages: this.data.pagination.totalPages,
        hasNextPage: this.data.pagination.page < this.data.pagination.totalPages,
        hasPrevPage: this.data.pagination.page > 1,
      },
    };
  }

  static make<T>(
    data: PaginatedData<T>,
    resourceClass: { new(item: T): { toArray(): any } }
  ) {
    return new PaginatedResource(data, (item) => new resourceClass(item).toArray()).toArray();
  }
}