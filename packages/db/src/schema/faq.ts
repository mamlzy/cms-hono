import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { pgTable, text, varchar } from 'drizzle-orm/pg-core';

import { timestamps } from '../lib/columns.helpers';
import { organizationTable } from './organization';
import { userTable } from './user';

export const faqTable = pgTable('faqs', {
  id: varchar({ length: 255 }).primaryKey().$defaultFn(createId),
  title: varchar({ length: 255 }).notNull(),
  description: text().notNull(),
  organizationId: varchar({ length: 255 })
    .notNull()
    .references(() => organizationTable.id),
  creatorId: varchar({ length: 255 })
    .notNull()
    .references(() => userTable.id),
  updaterId: varchar({ length: 255 }).references(() => userTable.id),
  ...timestamps,
});

export const faqRelations = relations(faqTable, ({ one }) => ({
  organization: one(organizationTable, {
    fields: [faqTable.organizationId],
    references: [organizationTable.id],
  }),
  creator: one(userTable, {
    fields: [faqTable.creatorId],
    references: [userTable.id],
  }),
  updater: one(userTable, {
    fields: [faqTable.updaterId],
    references: [userTable.id],
  }),
}));

export type Faq = typeof faqTable.$inferSelect;
export type FaqCreateInput = typeof faqTable.$inferInsert;
