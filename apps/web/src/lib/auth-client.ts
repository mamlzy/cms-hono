import { organizationClient, usernameClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL!, // the base url of your auth server
  emailAndPassword: {
    enabled: true,
  },
  plugins: [usernameClient(), organizationClient()],
});

export type Organization = typeof authClient.$Infer.Organization;
