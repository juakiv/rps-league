import { sql } from "drizzle-orm";

type AnyQuery = {
  execute: () => Promise<any[]>;
  limit: (limit: number) => any;
  offset: (offset: number) => any;
  as: (alias: string) => any;
};

type RowOf<T extends { execute: () => Promise<any[]> }> = Awaited<ReturnType<T["execute"]>>[number];

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

export async function paginate<T extends AnyQuery>(
  db: any,
  query: T,
  page = 1,
  pageSize = 20
): Promise<PaginationResult<RowOf<T>>> {
  const safePage = Math.max(page, 1);
  const safePageSize = Math.max(pageSize, 1);
  const offset = (safePage - 1) * safePageSize;

  const subQuery = query.as("sub");

  const dataPromise = query.limit(safePageSize).offset(offset).execute();

  const countPromise = db
    .select({ count: sql<number>`count(*)` })
    .from(subQuery)
    .execute();

  const [data, [{ count }]] = await Promise.all([dataPromise, countPromise]);

  return {
    data,
    pagination: {
      page: safePage,
      pageSize: safePageSize,
      totalItems: count,
      totalPages: Math.ceil(count / safePageSize),
    },
  };
}