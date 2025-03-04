import { z } from 'zod';

export const createMediaSchema = z.object({
  file: z.instanceof(File),
  folderId: z.string().optional(),
  organizationId: z.string().trim().nonempty(),
});
export type CreateMediaSchema = z.infer<typeof createMediaSchema>;

export const updateMediaSchema = createMediaSchema;
export type UpdateMediaSchema = z.infer<typeof updateMediaSchema>;

export const deleteMediaSchema = createMediaSchema.pick({
  folderId: true,
  organizationId: true,
});
export type DeleteMediaSchema = z.infer<typeof deleteMediaSchema>;

export const qsMediaSchema = z
  .object({
    name: z.string().trim().optional(),
    folderId: z.string().trim().optional(),
  })
  .optional()
  .default({});
export type QsMediaSchema = z.infer<typeof qsMediaSchema>;
