import { createId } from "@paralleldrive/cuid2";
import { timestamp } from "drizzle-orm/pg-core";
import { varchar, pgTable } from "drizzle-orm/pg-core";

export const userTable = pgTable('users', {
  id: varchar({ length: 255 }).primaryKey().$defaultFn(createId),
  name: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
  deletedAt: timestamp(),
});