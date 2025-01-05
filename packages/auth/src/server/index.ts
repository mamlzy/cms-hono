import { db } from '@repo/db'; // your drizzle instance
import {
  accountTable as account,
  invitationTable as invitation,
  memberTable as member,
  organizationTable,
  sessionTable as session,
  userTable as user,
  verificationTable as verification,
} from '@repo/db/schema';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { organization, username } from 'better-auth/plugins';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      account,
      session,
      user,
      verification,
      organization: organizationTable,
      member,
      invitation,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [username(), organization()],
  trustedOrigins: [process.env.NEXT_PUBLIC_WEB_BASE_URL!],
});
