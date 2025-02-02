import { postStatusEnum } from '@repo/db/schema';

import { pageAndLimitSchema, z } from '../lib/zod';

export const createPostSchema = z.object({
  title: z.string().trim().nonempty(),
  content: z.string().trim().nonempty(),
  thumbnailMediaId: z.string().trim().nonempty({ message: 'Required' }),
  status: z.enum(postStatusEnum.enumValues),
  organizationId: z.string().trim().nonempty(),
  categories: z.array(z.object({ id: z.string(), title: z.string() })),
});
export type CreatePostSchema = z.infer<typeof createPostSchema>;

export const updatePostSchema = createPostSchema.extend({
  //! `organizationId` is optional here
  organizationId: z.string().trim().optional(),
});
export type UpdatePostSchema = z.infer<typeof updatePostSchema>;

export const queryPostSchema = z
  .object({
    title: z.string().trim().optional(),
    organizationId: z.string().trim().optional(),
  })
  .merge(pageAndLimitSchema)
  .optional()
  .default({});
export type QueryPostSchema = z.infer<typeof queryPostSchema>;
