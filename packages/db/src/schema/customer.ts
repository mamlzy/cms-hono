import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { pgTable, varchar } from 'drizzle-orm/pg-core';

import { timestamps } from '../lib/columns.helpers';
import { mediaTable } from './media';
import { organizationTable } from './organization';
import { userTable } from './user';

export const customerTable = pgTable('customers', {
  id: varchar({ length: 255 }).primaryKey().$defaultFn(createId),
  name: varchar({ length: 255 }).notNull(),
  thumbnailMediaId: varchar({ length: 255 })
    .notNull()
    .references(() => mediaTable.id),
  organizationId: varchar({ length: 255 })
    .notNull()
    .references(() => organizationTable.id),
  creatorId: varchar({ length: 255 })
    .notNull()
    .references(() => userTable.id),
  updaterId: varchar({ length: 255 }).references(() => userTable.id),
  ...timestamps,
});

export const customerRelations = relations(customerTable, ({ one }) => ({
  creator: one(userTable, {
    fields: [customerTable.creatorId],
    references: [userTable.id],
  }),
  updater: one(userTable, {
    fields: [customerTable.updaterId],
    references: [userTable.id],
  }),
  organization: one(organizationTable, {
    fields: [customerTable.organizationId],
    references: [organizationTable.id],
  }),
  thumbnailMedia: one(mediaTable, {
    fields: [customerTable.thumbnailMediaId],
    references: [mediaTable.id],
  }),
}));

export type Customer = typeof customerTable.$inferSelect;
export type CustomerCreateInput = typeof customerTable.$inferInsert;
