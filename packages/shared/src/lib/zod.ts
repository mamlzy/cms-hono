import { z } from 'zod';

export const emailNotRequiredSchema = z
  .union([z.literal(''), z.string().email()])
  .nullable();

export { z };
