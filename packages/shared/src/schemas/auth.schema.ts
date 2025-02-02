import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().trim().nonempty(),
  name: z.string().trim().nonempty(),
  username: z.string().trim().nonempty(),
  password: z.string().trim().nonempty(),
});
export type RegisterSchema = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  username: z.string().trim().nonempty(),
  password: z.string().trim().nonempty(),
});
export type LoginSchema = z.infer<typeof loginSchema>;
