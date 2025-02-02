import {
  type CreateFaqSchema,
  type QueryFaqSchema,
  type UpdateFaqSchema,
} from '@repo/shared/schemas';
import type { ToQueryString } from '@repo/shared/types';

import { hcs } from '@/lib/hono-client';

const create = async (faq: CreateFaqSchema) => {
  const res = await hcs.api.faqs.$post({
    json: faq,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  const data = await res.json();
  return data.data;
};

const getAll = async (queryString?: ToQueryString<QueryFaqSchema>) => {
  const res = await hcs.api.faqs.$get({
    query: queryString,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  const data = await res.json();
  return data;
};
export type FaqGetAll = Awaited<ReturnType<typeof getAll>>['data'][number];

const getById = async (faqId: string) => {
  const res = await hcs.api.faqs[':faqId'].$get({
    param: {
      faqId,
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
  faqId,
  payload,
}: {
  faqId: string;
  payload: UpdateFaqSchema;
}) => {
  const res = await hcs.api.faqs[':faqId'].$put({
    param: {
      faqId,
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

const deleteById = async (faqId: string) => {
  const res = await hcs.api.faqs[':faqId'].$delete({
    param: {
      faqId,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  const data = await res.json();

  return data;
};

export const faqRequest = {
  create,
  getAll,
  getById,
  updateById,
  deleteById,
};
