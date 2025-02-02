import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { pgTable, varchar } from 'drizzle-orm/pg-core';

import { categoryTable } from './category';
import { postTable } from './post';

export const postToCategoryTable = pgTable('posts_to_categories', {
  id: varchar({ length: 255 }).primaryKey().$defaultFn(createId),
  postId: varchar({ length: 255 })
    .notNull()
    .references(() => postTable.id),
  categoryId: varchar({ length: 255 })
    .notNull()
    .references(() => categoryTable.id),
});

export type PostToCategory = typeof postToCategoryTable.$inferSelect;
export type PostToCategortCreateInput = typeof postToCategoryTable.$inferInsert;

export const postToCategoryRelations = relations(
  postToCategoryTable,
  ({ one }) => ({
    post: one(postTable, {
      fields: [postToCategoryTable.postId],
      references: [postTable.id],
    }),
    category: one(categoryTable, {
      fields: [postToCategoryTable.categoryId],
      references: [categoryTable.id],
    }),
  })
);
