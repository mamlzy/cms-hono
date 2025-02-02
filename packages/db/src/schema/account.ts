import { createId } from '@paralleldrive/cuid2';
import { pgEnum, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

import { userTable } from './user';

export const accountProviderId = pgEnum('provider_id', [
  'credential',
  'google',
  'github',
]);

export const accountTable = pgTable('accounts', {
  id: varchar({ length: 255 }).primaryKey().$defaultFn(createId),
  accountId: text().notNull(),
  providerId: accountProviderId().notNull(),
  userId: text()
    .notNull()
    .references(() => userTable.id),
  accessToken: text(),
  refreshToken: text(),
  idToken: text(),
  accessTokenExpiresAt: timestamp(),
  refreshTokenExpiresAt: timestamp(),
  scope: text(),
  password: text(),
  createdAt: timestamp().notNull(),
  updatedAt: timestamp().notNull(),
});

export type Account = typeof accountTable.$inferSelect;
export type AccountCreateInput = typeof accountTable.$inferInsert;
