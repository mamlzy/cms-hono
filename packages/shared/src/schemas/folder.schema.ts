import { z } from 'zod';

import { pageAndLimitSchema } from '../lib/zod';

export const createFolderSchema = z.object({
  name: z.string().trim().nonempty(),
  organizationId: z.string().trim().nonempty(),
  parentId: z.string().trim().nullable(),
});
export type CreateFolderSchema = z.infer<typeof createFolderSchema>;

export const updateFolderSchema = createFolderSchema;
export type UpdateFolderSchema = z.infer<typeof updateFolderSchema>;

export const qsFolderSchema = z
  .object({
    id: z.string().trim().optional(),
    name: z.string().trim().optional(),
  })
  .merge(pageAndLimitSchema)
  .optional()
  .default({});
export type QsFolderSchema = z.infer<typeof qsFolderSchema>;
