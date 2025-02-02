import { z } from 'zod';

export const emailNotRequiredSchema = z
  .union([z.literal(''), z.string().email()])
  .nullable();

export const requiredStringSchema = z.string().trim().nonempty();

export const pageAndLimitSchema = z.object({
  page: z.coerce.number().positive().optional().default(1),
  limit: z.coerce.number().positive().optional().default(10),
});

export { z };
