import type {
  CreateOrganizationSchema,
  SetActiveOrganizationSchema,
} from '@repo/shared/schemas';

import { hcs } from '@/lib/hono-client';

const create = async (payload: CreateOrganizationSchema) => {
  const res = await hcs.api.organizations.$post({
    json: payload,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  const data = await res.json();
  return data.data;
};

const getAll = async () => {
  const res = await hcs.api.organizations.$get();

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  const data = await res.json();
  return data.data;
};

const getByOrganizationId = async (organizationId: string) => {
  const res = await hcs.api.organizations.id[':organizationId'].$get({
    param: {
      organizationId,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  const data = await res.json();
  return data.data;
};

const setActiveOrganization = async (payload: SetActiveOrganizationSchema) => {
  const res = await hcs.api.organizations['set-active'].$post({
    json: payload,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  const data = await res.json();
  return data.data;
};

const getActiveOrganization = async () => {
  const res = await hcs.api.organizations['active-organization'].$get();

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  const data = await res.json();
  return data.data;
};

export const organizationRequest = {
  create,
  getAll,
  getByOrganizationId,
  setActiveOrganization,
  getActiveOrganization,
};
