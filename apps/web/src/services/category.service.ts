import { hc, hcsClient } from '@/lib/hono-client';

const getAll = async () => {
  const res = await hcsClient.api.categories.$get();
  const data = await res.json();

  console.log('data =>', data);

  return data.data;
};
export type CategoryGetAll = Awaited<ReturnType<typeof getAll>>[number];

const getByCataegoryId = async (categoryId: string) => {
  const res = await hc.api.categories[':categoryId'].$get({
    param: {
      categoryId,
    },
  });
  const data = await res.json();

  return data.data;
};

export const categoryService = {
  getAll,
  getByCataegoryId,
};
