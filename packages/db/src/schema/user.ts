import { createId } from '@paralleldrive/cuid2';
import {
  boolean,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const userTable = pgTable('users', {
  id: varchar({ length: 255 }).primaryKey().$defaultFn(createId),
  name: text().notNull(),
  email: text().notNull().unique(),
  emailVerified: boolean().notNull(),
  image: text(),
  createdAt: timestamp().notNull(),
  updatedAt: timestamp().notNull(),
  username: text().unique(),
});

export type User = typeof userTable.$inferSelect;
export type UserCreateInput = typeof userTable.$inferInsert;
