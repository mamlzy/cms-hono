import { zValidator } from '@hono/zod-validator';
import { and, count, db, desc, eq, ilike, isNull, type SQL } from '@repo/db';
import {
  postTable,
  postToCategoryTable,
  type PostToCategortCreateInput,
} from '@repo/db/schema';
import { createPagination } from '@repo/shared/lib/utils';
import {
  createPostSchema,
  queryPostSchema,
  updatePostSchema,
} from '@repo/shared/schemas';
import { Hono } from 'hono';
import slugify from 'slugify';

import { jsonS } from '../../lib/hono-superjson';
import type { AuthContext } from '../../types';

export const postRoutes = new Hono<AuthContext>()
  //! create
  .post('/', zValidator('json', createPostSchema), async (c) => {
    const user = c.get('user');

    if (!user) {
      return c.json({ message: 'Unauthorized.' }, 401);
    }

    const body = c.req.valid('json');

    const {
      title,
      content,
      status,
      organizationId,
      thumbnailMediaId,
      categories,
    } = body;

    const createdPost = await db.transaction(async (tx) => {
      const createdPost = await tx
        .insert(postTable)
        .values({
          title,
          slug: slugify(title, { lower: true }),
          content,
          status,
          organizationId,
          creatorId: user.id,
          thumbnailMediaId,
        })
        .returning();

      const postToCategoryInput: PostToCategortCreateInput[] = categories.map(
        (category) => ({
          postId: createdPost[0].id,
          categoryId: category.id,
        })
      );

      if (postToCategoryInput.length > 0) {
        //! insert postToCategory table
        await tx.insert(postToCategoryTable).values(postToCategoryInput);
      }

      return createdPost[0];
    });

    return c.json(
      {
        data: createdPost,
      },
      200
    );
  })
  //! get all
  .get('/', zValidator('query', queryPostSchema), async (c) => {
    const user = c.get('user');

    if (!user) {
      return c.json({ message: 'Unauthorized.' }, 401);
    }

    const { page, limit, organizationId, title } = c.req.valid('query');

    const offset = (page - 1) * limit;

    const where: SQL[] = [isNull(postTable.deletedAt)];

    if (organizationId) {
      where.push(eq(postTable.organizationId, organizationId));
    }
    if (title) {
      where.push(ilike(postTable.title, `%${title}%`));
    }

    const posts = await db.query.postTable.findMany({
      where: and(...where),
      with: {
        thumbnailMedia: true,
        postsToCategories: {
          columns: {},
          with: {
            category: true,
          },
        },
      },
      orderBy: desc(postTable.createdAt),
      offset,
      limit,
    });

    const totalCount = (
      await db
        .select({ count: count() })
        .from(postTable)
        .where(and(...where))
    )[0].count;

    const pagination = createPagination({
      page,
      limit,
      totalCount,
    });

    const simplifiedPosts = posts.map((post) => ({
      ...post,
      postsToCategories: undefined,
      categories: post.postsToCategories.map((c) => c.category),
    }));

    return c.json({ data: simplifiedPosts, pagination }, 200);
  })
  //! get by id
  .get('/:postId', async (c) => {
    const user = c.get('user');

    if (!user) {
      return c.json({ message: 'Unauthorized.' }, 401);
    }

    const postId = c.req.param('postId');

    const post = await db.query.postTable.findFirst({
      where: eq(postTable.id, postId),
      with: {
        thumbnailMedia: true,
        postsToCategories: {
          columns: {},
          with: {
            category: true,
          },
        },
      },
    });

    if (!post) {
      return c.json({ message: 'Post not found' }, 404);
    }

    const simplifiedPost = {
      ...post,
      categories: post.postsToCategories.map((c) => c.category),
    };

    return jsonS(c, { data: simplifiedPost }, 200);
  })
  //! update by id
  .put('/:postId', zValidator('json', updatePostSchema), async (c) => {
    const user = c.get('user');

    if (!user) {
      return c.json({ message: 'Unauthorized.' }, 401);
    }

    const postId = c.req.param('postId');
    const body = c.req.valid('json');
    const { title, content, status, thumbnailMediaId, categories } = body;

    const post = await db.query.postTable.findFirst({
      where: eq(postTable.id, postId),
    });

    if (!post) {
      return c.json({ message: 'Post not found' }, 404);
    }

    const updatedPost = await db.transaction(async (tx) => {
      //! update post
      const updatedPost = await tx
        .update(postTable)
        .set({
          updaterId: user.id,
          title,
          slug: slugify(title, { lower: true }),
          content,
          status,
          thumbnailMediaId,
        })
        .where(eq(postTable.id, postId))
        .returning();

      //! delete old postToCategory relations
      await tx
        .delete(postToCategoryTable)
        .where(eq(postToCategoryTable.postId, postId));

      //! add new postToCategory table
      const postToCategoryInput: PostToCategortCreateInput[] = categories.map(
        (category) => ({
          postId: updatedPost[0].id,
          categoryId: category.id,
        })
      );

      if (postToCategoryInput.length > 0) {
        await tx.insert(postToCategoryTable).values(postToCategoryInput);
      }

      return updatedPost[0];
    });

    return c.json(
      {
        data: updatedPost,
      },
      200
    );
  })
  //! delete by id
  .delete('/:postId', async (c) => {
    const user = c.get('user');

    if (!user) {
      return c.json({ message: 'Unauthorized.' }, 401);
    }

    const postId = c.req.param('postId');

    const deletedPost = await db.transaction(async (tx) => {
      //! delete postToCategory table
      await tx
        .delete(postToCategoryTable)
        .where(eq(postToCategoryTable.postId, postId));

      //! delete post
      const deletedPost = await tx
        .delete(postTable)
        .where(eq(postTable.id, postId))
        .returning();

      if (deletedPost.length === 0) {
        return c.json({ message: 'Post not found' }, 404);
      }

      return deletedPost[0];
    });

    return c.json(
      {
        message: 'Post Deleted',
        data: deletedPost,
      },
      200
    );
  });
