import { categoryTable } from '../schema/category';

export type Category = typeof categoryTable.$inferSelect;
export type CategoryCreateInput = typeof categoryTable.$inferInsert;
