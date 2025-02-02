import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { pgTable, varchar } from 'drizzle-orm/pg-core';

import { timestamps } from '../lib/columns.helpers';
import { organizationTable } from './organization';
import { postToCategoryTable } from './post-to-category';
import { userTable } from './user';

export const categoryTable = pgTable('categories', {
  id: varchar({ length: 255 }).primaryKey().$defaultFn(createId),
  title: varchar({ length: 255 }).notNull(),
  slug: varchar({ length: 300 }).notNull(),
  organizationId: varchar({ length: 255 })
    .notNull()
    .references(() => organizationTable.id),
  creatorId: varchar({ length: 255 })
    .notNull()
    .references(() => userTable.id),
  updaterId: varchar({ length: 255 }).references(() => userTable.id),
  ...timestamps,
});

export const categoryRelations = relations(categoryTable, ({ one, many }) => ({
  postsToCategories: many(postToCategoryTable),
  creator: one(userTable, {
    fields: [categoryTable.creatorId],
    references: [userTable.id],
  }),
  updater: one(userTable, {
    fields: [categoryTable.updaterId],
    references: [userTable.id],
  }),
  organization: one(organizationTable, {
    fields: [categoryTable.organizationId],
    references: [organizationTable.id],
  }),
}));

export type Category = typeof categoryTable.$inferSelect;
export type CategoryCreateInput = typeof categoryTable.$inferInsert;
