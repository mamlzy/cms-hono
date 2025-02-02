import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

import { postTable } from './post';

export const organizationTable = pgTable('organizations', {
  id: text().primaryKey(),
  name: text().notNull(),
  slug: text().unique().notNull(),
  logo: text(),
  metadata: text(),
  createdAt: timestamp().notNull(),
});

export const organizationRelations = relations(
  organizationTable,
  ({ many }) => ({
    posts: many(postTable),
  })
);

export type Organization = typeof organizationTable.$inferSelect;
export type OrganizationCreateInput = typeof organizationTable.$inferInsert;
