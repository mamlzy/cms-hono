export * from './utils.type';

export type Option<T = string> = { value: T; label: string };

export type PaginationRes = {
  isFirstPage: boolean;
  isLastPage: boolean;
  currentPage: number;
  previousPage: number | null;
  nextPage: number | null;
  pageCount: number;
  totalCount: number;
};

export type Res<TData> = {
  status?: string;
  code?: number;
  error: Error;
  data: TData;
} & (TData extends Array<any> ? { pagination?: PaginationRes } : {});
