import { usernameClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: 'http://localhost:5000', // the base url of your auth server
  emailAndPassword: {
    enabled: true,
  },
  plugins: [usernameClient()],
});
