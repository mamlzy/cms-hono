import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { pgEnum, pgTable, text, varchar } from 'drizzle-orm/pg-core';

import { timestamps } from '../lib/columns.helpers';
import { mediaTable } from './media';
import { organizationTable } from './organization';
import { postToCategoryTable } from './post-to-category';
import { userTable } from './user';

export const postStatusEnum = pgEnum('status', ['PUBLISHED', 'DRAFT']);
export type PostStatus = (typeof postStatusEnum.enumValues)[number];

export const postTable = pgTable('posts', {
  id: varchar({ length: 255 }).primaryKey().$defaultFn(createId),
  title: varchar({ length: 255 }).notNull(),
  slug: varchar({ length: 300 }).notNull(),
  thumbnailMediaId: varchar({ length: 255 })
    .notNull()
    .references(() => mediaTable.id),
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

export const postRelations = relations(postTable, ({ one, many }) => ({
  creator: one(userTable, {
    fields: [postTable.creatorId],
    references: [userTable.id],
  }),
  updater: one(userTable, {
    fields: [postTable.updaterId],
    references: [userTable.id],
  }),
  postsToCategories: many(postToCategoryTable),
  thumbnailMedia: one(mediaTable, {
    fields: [postTable.thumbnailMediaId],
    references: [mediaTable.id],
  }),
  organization: one(organizationTable, {
    fields: [postTable.organizationId],
    references: [organizationTable.id],
  }),
}));
