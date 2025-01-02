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
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [username()],
  trustedOrigins: ['http://localhost:3000'],
});

export const betterAuthView = (context: Context) => {
  const BETTER_AUTH_ACCEPT_METHODS = ['POST', 'GET'];
  if (BETTER_AUTH_ACCEPT_METHODS.includes(context.request.method)) {
    console.log(context.request);
    return auth.handler(context.request);
  }

  return context.error(405);
};
