import { z } from 'zod';

import { requiredStringSchema } from '../lib/zod';

export const createOrganizationSchema = z.strictObject({
  name: requiredStringSchema,
  logo: requiredStringSchema,
  metadata: z.string().trim().nullable(),
});

export type CreateOrganizationSchema = z.infer<typeof createOrganizationSchema>;

export const setActiveOrganizationSchema = z.strictObject({
  organizationId: requiredStringSchema,
});

export type SetActiveOrganizationSchema = z.infer<
  typeof setActiveOrganizationSchema
>;
