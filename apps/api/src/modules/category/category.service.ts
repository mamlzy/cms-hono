import { db, eq } from '@repo/db';
import { categoryTable } from '@repo/db/schema';

export const getCategoryById = async (id: string) => {
  const category = await db.query.categoryTable.findFirst({
    where: eq(categoryTable.id, id),
  });

  return category;
};

export const getCategoryBySlug = async (slug: string) => {
  const category = await db.query.categoryTable.findFirst({
    where: eq(categoryTable.slug, slug),
  });

  return category;
};
