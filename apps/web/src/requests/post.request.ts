import {
  type CreatePostSchema,
  type QueryPostSchema,
  type UpdatePostSchema,
} from '@repo/shared/schemas';
import type { ToQueryString } from '@repo/shared/types';

import { hcs } from '@/lib/hono-client';

const create = async (post: CreatePostSchema) => {
  const res = await hcs.api.posts.$post({
    json: post,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  const data = await res.json();
  return data.data;
};

const getAll = async (queryString?: ToQueryString<QueryPostSchema>) => {
  const res = await hcs.api.posts.$get({
    query: queryString,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  const data = await res.json();
  return data;
};
export type PostGetAll = Awaited<ReturnType<typeof getAll>>['data'][number];

const getById = async (postId: string) => {
  const res = await hcs.api.posts[':postId'].$get({
    param: {
      postId,
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
  postId,
  payload,
}: {
  postId: string;
  payload: UpdatePostSchema;
}) => {
  const res = await hcs.api.posts[':postId'].$put({
    param: {
      postId,
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

const deleteById = async (postId: string) => {
  const res = await hcs.api.posts[':postId'].$delete({
    param: {
      postId,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  const data = await res.json();

  return data;
};

export const postRequest = {
  create,
  getAll,
  getById,
  updateById,
  deleteById,
};
