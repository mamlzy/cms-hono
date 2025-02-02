import { z } from 'zod';

import { pageAndLimitSchema } from '../lib/zod';

export const createFaqSchema = z.object({
  title: z.string().trim().nonempty(),
  organizationId: z.string().trim().nonempty(),
  description: z.string().trim().nonempty(),
});
export type CreateFaqSchema = z.infer<typeof createFaqSchema>;

export const updateFaqSchema = createFaqSchema;
export type UpdateFaqSchema = z.infer<typeof updateFaqSchema>;

export const queryFaqSchema = z
  .object({
    organizationId: z.string().trim().optional(),
    title: z.string().trim().optional(),
  })
  .merge(pageAndLimitSchema)
  .optional()
  .default({});
export type QueryFaqSchema = z.infer<typeof queryFaqSchema>;
