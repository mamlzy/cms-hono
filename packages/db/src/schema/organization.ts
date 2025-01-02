import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const organizationTable = pgTable('organizations', {
  id: text().primaryKey(),
  name: text().notNull(),
  slug: text().unique(),
  logo: text(),
  createdAt: timestamp().notNull(),
  metadata: text(),
});
