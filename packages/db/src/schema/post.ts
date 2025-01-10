import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { pgEnum, pgTable, text, varchar } from 'drizzle-orm/pg-core';

import { timestamps } from '../lib/columns.helpers';
import { organizationTable } from './organization';
import { postToCategoryTable } from './post-to-category';
import { userTable } from './user';

export const postStatusEnum = pgEnum('status', ['PUBLISHED', 'DRAFT']);
export type PostStatus = (typeof postStatusEnum.enumValues)[number];

export const postTable = pgTable('posts', {
  id: varchar({ length: 255 }).primaryKey().$defaultFn(createId),
  title: varchar({ length: 255 }).notNull(),
  slug: varchar({ length: 300 }).notNull(),
  thumbnailUrl: text().notNull(),
  content: text().notNull(),
  status: postStatusEnum(),
  organizationId: varchar({ length: 255 })
    .notNull()
    .references(() => organizationTable.id),
  creatorId: varchar({ length: 255 })
    .notNull()
    .references(() => userTable.id),
  updaterId: varchar({ length: 255 }).references(() => userTable.id),
  ...timestamps,
});

export const postRelations = relations(postTable, ({ many }) => ({
  postsToCategories: many(postToCategoryTable),
}));
