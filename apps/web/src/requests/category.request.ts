import {
  type CreateCategorySchema,
  type QueryCategorySchema,
  type UpdateCategorySchema,
} from '@repo/shared/schemas';
import type { ToQueryString } from '@repo/shared/types';

import { hcs } from '@/lib/hono-client';

const create = async (category: CreateCategorySchema) => {
  const res = await hcs.api.categories.$post({
    json: category,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  const data = await res.json();
  return data.data;
};

const getAll = async (queryString?: ToQueryString<QueryCategorySchema>) => {
  const res = await hcs.api.categories.$get({
    query: queryString,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  const data = await res.json();
  return data;
};
export type CategoryGetAll = Awaited<ReturnType<typeof getAll>>['data'][number];

const getById = async (categoryId: string) => {
  const res = await hcs.api.categories.id[':categoryId'].$get({
    param: {
      categoryId,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  const data = await res.json();
  return data.data;
};

const getBySlug = async (categorySlug: string) => {
  const res = await hcs.api.categories.slug[':categorySlug'].$get({
    param: {
      categorySlug,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  const data = await res.json();
  return data.data;
};

const updateById = async ({
  categoryId,
  payload,
}: {
  categoryId: string;
  payload: UpdateCategorySchema;
}) => {
  const res = await hcs.api.categories[':categoryId'].$put({
    param: {
      categoryId,
    },
    json: payload,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  const data = await res.json();
  return data.data;
};

const deleteById = async (categoryId: string) => {
  const res = await hcs.api.categories[':categoryId'].$delete({
    param: {
      categoryId,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  const data = await res.json();

  return data;
};

export const categoryRequest = {
  create,
  getAll,
  getById,
  getBySlug,
  updateById,
  deleteById,
};
