import { db } from '@repo/db'; // your drizzle instance
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { username } from 'better-auth/plugins';

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [username()],
  trustedOrigins: ['http://localhost:3000'],
});
