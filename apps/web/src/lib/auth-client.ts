import { organizationClient, usernameClient } from 'better-auth/client/plugins';
import { nextCookies } from 'better-auth/next-js';
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL!, // the base url of your auth server
  emailAndPassword: {
    enabled: true,
  },
  plugins: [usernameClient(), organizationClient(), nextCookies()],
});
