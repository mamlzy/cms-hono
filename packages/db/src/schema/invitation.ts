import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

import { organizationTable } from './organization';
import { userTable } from './user';

export const invitationTable = pgTable('invitations', {
  id: text().primaryKey(),
  organizationId: text()
    .notNull()
    .references(() => organizationTable.id),
  email: text().notNull(),
  role: text(),
  status: text().notNull(),
  expiresAt: timestamp().notNull(),
  inviterId: text()
    .notNull()
    .references(() => userTable.id),
});
