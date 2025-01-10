import { relations } from 'drizzle-orm';
import { pgTable, varchar } from 'drizzle-orm/pg-core';

import { categoryTable } from './category';
import { postTable } from './post';

export const postToCategoryTable = pgTable('posts_to_categories', {
  postId: varchar({ length: 255 })
    .notNull()
    .references(() => postTable.id),
  categoryId: varchar({ length: 255 })
    .notNull()
    .references(() => categoryTable.id),
});

export const postToCategoryRelations = relations(
  postToCategoryTable,
  ({ one }) => ({
    post: one(postTable, {
      fields: [postToCategoryTable.postId],
      references: [postTable.id],
    }),
    categoryTable: one(categoryTable, {
      fields: [postToCategoryTable.categoryId],
      references: [categoryTable.id],
    }),
  })
);
