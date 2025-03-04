import { db } from '@repo/db';
import {
  accountTable,
  invitationTable,
  memberTable,
  organizationTable,
  sessionTable,
  userTable,
  verificationTable,
} from '@repo/db/schema';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { organization, username } from 'better-auth/plugins';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: userTable,
      session: sessionTable,
      account: accountTable,
      verification: verificationTable,
      organization: organizationTable,
      member: memberTable,
      invitation: invitationTable,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [username(), organization()],
  trustedOrigins: [process.env.NEXT_PUBLIC_WEB_BASE_URL!],
  advanced: {
    defaultCookieAttributes: {
      domain: process.env.DOMAIN,
    },
  },
});

export type Session = typeof auth.$Infer.Session;
export type Organization = typeof auth.$Infer.Organization;
