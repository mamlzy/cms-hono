import { zValidator } from '@hono/zod-validator';
import { and, count, db, desc, eq, ilike, isNull, SQL } from '@repo/db';
import { categoryTable } from '@repo/db/schema';
import { createPagination } from '@repo/shared/lib/utils';
import {
  createCategorySchema,
  queryCategorySchema,
  updateCategorySchema,
} from '@repo/shared/schemas';
import { Hono } from 'hono';
import slugify from 'slugify';

import { jsonS } from '../../lib/hono-superjson';
import type { AuthContext } from '../../types';
import { getCategoryById, getCategoryBySlug } from './category.service';

export const categoryRoutes = new Hono<AuthContext>()
  //! create
  .post('/', zValidator('json', createCategorySchema), async (c) => {
    const user = c.get('user');

    if (!user) {
      return c.json({ message: 'Unauthorized.' }, 401);
    }

    const { title, organizationId } = c.req.valid('json');
    const slug = slugify(title, { lower: true });

    const existingCategory = await db.query.categoryTable.findFirst({
      where: eq(categoryTable.slug, slug),
    });

    if (existingCategory) {
      return c.json(
        {
          message: 'Category with that title already exists.',
        },
        400
      );
    }

    const createdCategory = await db
      .insert(categoryTable)
      .values({
        creatorId: user.id,
        title,
        slug,
        organizationId,
      })
      .returning();

    return c.json(
      {
        data: createdCategory[0],
      },
      200
    );
  })
  //! get all
  .get('/', zValidator('query', queryCategorySchema), async (c) => {
    const user = c.get('user');

    if (!user) {
      return c.json({ message: 'Unauthorized.' }, 401);
    }

    const { page, limit, organizationId, title } = c.req.valid('query');

    const offset = (page - 1) * limit;

    const where: SQL[] = [isNull(categoryTable.deletedAt)];

    if (organizationId) {
      where.push(eq(categoryTable.organizationId, organizationId));
    }

    if (title) {
      where.push(ilike(categoryTable.title, `%${title}%`));
    }

    const categories = await db.query.categoryTable.findMany({
      where: and(...where),
      orderBy: desc(categoryTable.createdAt),
      offset,
      limit,
    });

    const totalCount = (
      await db
        .select({ count: count() })
        .from(categoryTable)
        .where(and(...where))
    )[0].count;

    const pagination = createPagination({
      page,
      limit,
      totalCount,
    });

    return c.json({ data: categories, pagination }, 200);
  })
  //! get by category id
  .get('/id/:categoryId', async (c) => {
    const user = c.get('user');

    if (!user) {
      return c.json({ message: 'Unauthorized.' }, 401);
    }

    const categoryId = c.req.param('categoryId');

    const category = await getCategoryById(categoryId);

    if (!category) {
      return c.json({ message: 'Category not found' }, 404);
    }

    return c.json(
      {
        data: category,
      },
      200
    );
  })
  //! get by category slug
  .get('/slug/:categorySlug', async (c) => {
    const user = c.get('user');

    if (!user) {
      return c.json({ message: 'Unauthorized.' }, 401);
    }

    const categorySlug = c.req.param('categorySlug');

    const category = await getCategoryBySlug(categorySlug);

    console.log('category =>', category);

    if (!category) {
      return c.json({ message: 'Category not found' }, 404);
    }

    return jsonS(
      c,
      {
        data: category,
      },
      200
    );
  })
  //! update by categoryId
  .put('/:categoryId', zValidator('json', updateCategorySchema), async (c) => {
    const user = c.get('user');

    if (!user) {
      return c.json({ message: 'Unauthorized.' }, 401);
    }

    const categoryId = c.req.param('categoryId');
    const { title, organizationId } = c.req.valid('json');

    const updatedCategory = await db
      .update(categoryTable)
      .set({
        updaterId: user.id,
        updatedAt: new Date(),
        title,
        slug: slugify(title, { lower: true }),
        organizationId,
      })
      .where(eq(categoryTable.id, categoryId))
      .returning();

    if (updatedCategory.length === 0) {
      return c.json({ message: 'Category not found' }, 404);
    }

    return c.json(
      {
        data: updatedCategory[0],
      },
      200
    );
  })
  //! delete by categoryId
  .delete('/:categoryId', async (c) => {
    const user = c.get('user');

    if (!user) {
      return c.json({ message: 'Unauthorized.' }, 401);
    }

    const categoryId = c.req.param('categoryId');

    const category = await db.query.categoryTable.findFirst({
      where: eq(categoryTable.id, categoryId),
    });

    if (!category) {
      return c.json({ message: 'Category not found' }, 404);
    }

    const deletedCategory = await db
      .delete(categoryTable)
      .where(eq(categoryTable.id, categoryId))
      .returning();

    if (deletedCategory.length === 0) {
      return c.json({ message: 'Category not found' }, 404);
    }

    return c.json(
      {
        message: 'Deleted',
      },
      200
    );
  });
