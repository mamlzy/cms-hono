import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { pgTable, varchar } from 'drizzle-orm/pg-core';

import { timestamps } from '../lib/columns.helpers';
import { postToCategoryTable } from './post-to-category';
import { userTable } from './user';

export const categoryTable = pgTable('categories', {
  id: varchar({ length: 255 }).primaryKey().$defaultFn(createId),
  title: varchar({ length: 255 }).notNull(),
  slug: varchar({ length: 300 }).notNull(),
  creatorId: varchar({ length: 255 })
    .notNull()
    .references(() => userTable.id),
  updaterId: varchar({ length: 255 }).references(() => userTable.id),
  ...timestamps,
});

export const categoryRelations = relations(categoryTable, ({ many }) => ({
  postsToCategories: many(postToCategoryTable),
}));
