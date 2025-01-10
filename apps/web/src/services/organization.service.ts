import { betterFetch } from '@better-fetch/fetch';

import type { Organization } from '@/lib/auth-client';
import { hc } from '@/lib/hono-client';

const getAll = async () => {
  const res = await hc.api.organizations.$get();
  const data = await res.json();

  return data.data;
};

const getByOrganizationId = async (orgSlug: string) => {
  const res = await hc.api.organizations[':orgSlug'].$get({
    param: {
      orgSlug,
    },
  });
  const data = await res.json();

  return data.data;
};

const getActiveOrganization = async () => {
  const { data } = await betterFetch<Organization | null>(
    '/api/auth/organization/get-full-organization',
    {
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
      credentials: 'include',
    }
  );

  return data;
};

export const organizationService = {
  getAll,
  getByOrganizationId,
  getActiveOrganization,
};
