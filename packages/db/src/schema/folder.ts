import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { pgTable } from 'drizzle-orm/pg-core';

import { timestamps } from '../lib/columns.helpers';
import { mediaTable } from './media';
import { organizationTable } from './organization';
import { userTable } from './user';

export const folderTable = pgTable('folders', (t) => ({
  id: t.varchar({ length: 255 }).primaryKey().$defaultFn(createId),
  name: t.varchar({ length: 255 }).notNull(),
  slug: t.varchar({ length: 255 }).notNull(),
  parentId: t.varchar({ length: 255 }),
  organizationId: t
    .varchar({ length: 255 })
    .notNull()
    .references(() => organizationTable.id),
  creatorId: t
    .varchar({ length: 255 })
    .notNull()
    .references(() => userTable.id),
  updaterId: t.varchar({ length: 255 }).references(() => userTable.id),
  ...timestamps,
}));

export const folderRelations = relations(folderTable, ({ one, many }) => ({
  parent: one(folderTable, {
    fields: [folderTable.parentId],
    references: [folderTable.id],
  }),
  medias: many(mediaTable),
  organization: one(organizationTable, {
    fields: [folderTable.organizationId],
    references: [organizationTable.id],
  }),
  creator: one(userTable, {
    fields: [folderTable.creatorId],
    references: [userTable.id],
  }),
  updater: one(userTable, {
    fields: [folderTable.updaterId],
    references: [userTable.id],
  }),
}));

export type Folder = typeof folderTable.$inferSelect;
export type FolderCreateInput = typeof folderTable.$inferInsert;
