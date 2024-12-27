import { db } from '@repo/db'; // your drizzle instance
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { username } from 'better-auth/plugins';
import dotenv from 'dotenv';
import { Context } from 'elysia';

import { ENV_PATH } from '../constants';

dotenv.config({
  debug: true,
  path: ENV_PATH,
});

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [username()],
  trustedOrigins: [process.env.NEXT_PUBLIC_WEB_BASE_URL!],
});

export const betterAuthView = (context: Context) => {
  const BETTER_AUTH_ACCEPT_METHODS = ['POST', 'GET'];
  if (BETTER_AUTH_ACCEPT_METHODS.includes(context.request.method)) {
    console.log(context.request);
    return auth.handler(context.request);
  }

  return context.error(405);
};
