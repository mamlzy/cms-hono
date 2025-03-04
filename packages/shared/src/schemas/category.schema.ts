import { z } from 'zod';

import { pageAndLimitSchema } from '../lib/zod';

export const createCategorySchema = z.object({
  title: z.string().trim().nonempty(),
  organizationId: z.string().trim().nonempty(),
});
export type CreateCategorySchema = z.infer<typeof createCategorySchema>;

export const updateCategorySchema = createCategorySchema;
export type UpdateCategorySchema = z.infer<typeof updateCategorySchema>;

export const qsCategorySchema = z
  .object({
    organizationId: z.string().trim().optional(),
    title: z.string().trim().optional(),
  })
  .merge(pageAndLimitSchema)
  .optional()
  .default({});
export type QsCategorySchema = z.infer<typeof qsCategorySchema>;
