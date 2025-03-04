import { type Res } from '@repo/shared/types';

export const getNextPageParamFn = (
  lastPage: Res<any[]>,
  allPages: Res<any[]>[],
  lastPageParam: number
) => {
  if (lastPage.data.length === 0) return undefined;

  const lastPageData = lastPage.data;
  const lastPagePagination = lastPage.pagination;

  if (lastPageData.length === lastPagePagination?.totalCount) return undefined;

  return lastPageParam + 1;
};
