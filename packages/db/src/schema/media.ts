import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { integer, pgTable, text, varchar } from 'drizzle-orm/pg-core';

import { timestamps } from '../lib/columns.helpers';
import { folderTable } from './folder';
import { postTable } from './post';
import { userTable } from './user';

export const mediaTable = pgTable('medias', {
  id: varchar({ length: 255 }).primaryKey().$defaultFn(createId),
  originalName: varchar({ length: 255 }).notNull(),
  storedName: varchar({ length: 255 }).notNull(),
  url: text().notNull(),
  size: integer().notNull(),
  type: text().notNull(),
  folderId: varchar({ length: 255 }).references(() => folderTable.id, {
    onUpdate: 'cascade',
  }),
  creatorId: varchar({ length: 255 })
    .notNull()
    .references(() => userTable.id),
  updaterId: varchar({ length: 255 }).references(() => userTable.id),
  ...timestamps,
});

export const mediaRelations = relations(mediaTable, ({ one, many }) => ({
  posts: many(postTable),
  folder: one(folderTable, {
    fields: [mediaTable.folderId],
    references: [folderTable.id],
  }),
  creator: one(userTable, {
    fields: [mediaTable.creatorId],
    references: [userTable.id],
  }),
  updater: one(userTable, {
    fields: [mediaTable.updaterId],
    references: [userTable.id],
  }),
}));

export type Media = typeof mediaTable.$inferSelect;
export type MediaCreateInput = typeof mediaTable.$inferInsert;
