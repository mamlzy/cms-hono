import { postStatusEnum } from '@repo/db/schema';

import { pageAndLimitSchema, z } from '../lib/zod';

export const createCustomerSchema = z.object({
  organizationId: z.string().trim().nonempty(),
  name: z.string().trim().nonempty(),
  thumbnailMediaId: z.string().trim().nonempty({ message: 'Required' }),
});
export type CreateCustomerSchema = z.infer<typeof createCustomerSchema>;

export const updateCustomerSchema = createCustomerSchema.extend({
  //! `organizationId` is optional here
  organizationId: z.string().trim().optional(),
});
export type UpdateCustomerSchema = z.infer<typeof updateCustomerSchema>;

export const queryCustomerSchema = z
  .object({
    name: z.string().trim().optional(),
    organizationId: z.string().trim().optional(),
  })
  .merge(pageAndLimitSchema)
  .optional()
  .default({});
export type QueryCustomerSchema = z.infer<typeof queryCustomerSchema>;
