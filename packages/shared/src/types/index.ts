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

export type OmitStrict<T, K extends keyof T> = T extends any
  ? Pick<T, Exclude<keyof T, K>>
  : never;

export type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};
