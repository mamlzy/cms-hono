import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

import { organizationTable } from './organization';
import { userTable } from './user';

export const memberTable = pgTable('members', {
  id: text().primaryKey(),
  organizationId: text()
    .notNull()
    .references(() => organizationTable.id),
  userId: text()
    .notNull()
    .references(() => userTable.id),
  role: text().notNull(),
  createdAt: timestamp().notNull(),
});
