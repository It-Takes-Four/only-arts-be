export class PaginationUtils {
  static ensurePagination<T>(
    result: { data: T[]; pagination?: any },
    page: number = 1,
    limit: number = 10
  ): { data: T[]; pagination: { page: number; limit: number; total: number; totalPages: number } } {
    return {
      data: result.data,
      pagination: result.pagination || {
        page,
        limit,
        total: result.data.length,
        totalPages: Math.ceil(result.data.length / limit),
      },
    };
  }

  static transformPaginatedData<T, R>(
    result: { data: T[]; pagination?: any },
    transformer: (item: T) => R,
    page: number = 1,
    limit: number = 10
  ): { data: R[]; pagination: { page: number; limit: number; total: number; totalPages: number } } {
    const ensuredResult = this.ensurePagination(result, page, limit);
    
    return {
      data: ensuredResult.data.map(transformer),
      pagination: ensuredResult.pagination,
    };
  }
}