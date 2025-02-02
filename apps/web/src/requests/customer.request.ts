import {
  type CreateCustomerSchema,
  type QueryCustomerSchema,
  type UpdateCustomerSchema,
} from '@repo/shared/schemas';
import type { ToQueryString } from '@repo/shared/types';

import { hcs } from '@/lib/hono-client';

const create = async (customer: CreateCustomerSchema) => {
  const res = await hcs.api.customers.$post({
    json: customer,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  const data = await res.json();
  return data.data;
};

const getAll = async (queryString?: ToQueryString<QueryCustomerSchema>) => {
  const res = await hcs.api.customers.$get({
    query: queryString,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  const data = await res.json();
  return data;
};
export type CustomerGetAll = Awaited<ReturnType<typeof getAll>>['data'][number];

const getById = async (customerId: string) => {
  const res = await hcs.api.customers[':customerId'].$get({
    param: {
      customerId,
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
  customerId,
  payload,
}: {
  customerId: string;
  payload: UpdateCustomerSchema;
}) => {
  const res = await hcs.api.customers[':customerId'].$put({
    param: {
      customerId,
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

const deleteById = async (customerId: string) => {
  const res = await hcs.api.customers[':customerId'].$delete({
    param: {
      customerId,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  const data = await res.json();

  return data;
};

export const customerRequest = {
  create,
  getAll,
  getById,
  updateById,
  deleteById,
};
