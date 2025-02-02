import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { integer, pgTable, text, varchar } from 'drizzle-orm/pg-core';

import { timestamps } from '../lib/columns.helpers';
import { postTable } from './post';
import { userTable } from './user';

export const mediaTable = pgTable('medias', {
  id: varchar({ length: 255 }).primaryKey().$defaultFn(createId),
  originalName: varchar({ length: 255 }).notNull(),
  storedName: varchar({ length: 255 }).notNull(),
  url: text().notNull(),
  size: integer().notNull(),
  type: text().notNull(),
  creatorId: varchar({ length: 255 })
    .notNull()
    .references(() => userTable.id),
  updaterId: varchar({ length: 255 }).references(() => userTable.id),
  ...timestamps,
});

export const mediaRelations = relations(mediaTable, ({ many }) => ({
  posts: many(postTable),
}));

export type Media = typeof mediaTable.$inferSelect;
export type MediaCreateInput = typeof mediaTable.$inferInsert;
