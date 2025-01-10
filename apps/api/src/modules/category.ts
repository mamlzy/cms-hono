import type { BetterAuthContext } from '@/types';
import { zValidator } from '@hono/zod-validator';
import { db, eq } from '@repo/db';
import { categoryTable } from '@repo/db/schema';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';

export const categoryRoutes = new Hono<BetterAuthContext>()
  //! get all
  .get('/', async (c) => {
    const user = c.get('user');

    if (!user) {
      throw new HTTPException(401);
    }

    const categories = await db.query.categoryTable.findMany();

    return c.json({ data: categories });
  })
  //! get by category id
  .get('/:categoryId', async (c) => {
    const user = c.get('user');

    if (!user) {
      throw new HTTPException(401);
    }

    const categoryId = c.req.param('categoryId');

    const category = await db.query.categoryTable.findFirst({
      where: eq(categoryTable.id, categoryId),
    });

    if (!category) {
      throw new HTTPException(404, { message: 'Category not found' });
    }

    return c.json({
      data: category,
    });
  })
  //! create
  .post(
    '/',
    zValidator(
      'json',
      z.object({
        title: z.string().trim().nonempty(),
        slug: z.string().trim().nonempty(),
      })
    ),
    async (c) => {
      const user = c.get('user');

      if (!user) {
        throw new HTTPException(401);
      }

      const { title, slug } = c.req.valid('json');

      const createdCategory = await db
        .insert(categoryTable)
        .values({
          creatorId: user.id,
          title,
          slug,
        })
        .returning();

      return c.json({
        data: createdCategory[0],
      });
    }
  )
  //! update by categoryId
  .put(
    '/:categoryId',
    zValidator(
      'json',
      z.object({
        title: z.string().trim().nonempty(),
        slug: z.string().trim().nonempty(),
      })
    ),
    async (c) => {
      const user = c.get('user');

      if (!user) {
        throw new HTTPException(401);
      }

      const categoryId = c.req.param('categoryId');
      const { title, slug } = c.req.valid('json');

      const updatedCategory = await db
        .update(categoryTable)
        .set({
          updaterId: user.id,
          updatedAt: new Date(),
          title,
          slug,
        })
        .where(eq(categoryTable.id, categoryId))
        .returning();

      if (updatedCategory.length === 0) {
        throw new HTTPException(404, { message: 'Category not found' });
      }

      return c.json({
        data: updatedCategory[0],
      });
    }
  )
  //! delete by categoryId
  .delete('/:categoryId', async (c) => {
    const user = c.get('user');

    if (!user) {
      throw new HTTPException(401);
    }

    const categoryId = c.req.param('categoryId');

    const deletedCategory = await db
      .delete(categoryTable)
      .where(eq(categoryTable.id, categoryId))
      .returning();

    console.log('deletedCategory =>', deletedCategory);

    if (deletedCategory.length === 0) {
      throw new HTTPException(404, { message: 'Category not found' });
    }

    return c.json({
      message: 'Deleted',
    });
  });
