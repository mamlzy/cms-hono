import { zValidator } from '@hono/zod-validator';
import { and, count, db, desc, eq, ilike, isNull, SQL } from '@repo/db';
import { faqTable } from '@repo/db/schema';
import { createPagination } from '@repo/shared/lib/utils';
import {
  createFaqSchema,
  queryFaqSchema,
  updateFaqSchema,
} from '@repo/shared/schemas';
import { Hono } from 'hono';

import type { AuthContext } from '../../types';
import { getFaqById } from './faq.service';

export const faqRoutes = new Hono<AuthContext>()
  //! create
  .post('/', zValidator('json', createFaqSchema), async (c) => {
    const user = c.get('user');

    if (!user) {
      return c.json({ message: 'Unauthorized.' }, 401);
    }

    const { organizationId, title, description } = c.req.valid('json');

    const existingFaq = await db.query.faqTable.findFirst({
      where: eq(faqTable.title, title),
    });

    if (existingFaq) {
      return c.json(
        {
          message: 'Faq with that title already exists.',
        },
        400
      );
    }

    const createdFaq = await db
      .insert(faqTable)
      .values({
        creatorId: user.id,
        organizationId,
        title,
        description,
      })
      .returning();

    return c.json(
      {
        data: createdFaq[0],
      },
      200
    );
  })
  //! get all
  .get('/', zValidator('query', queryFaqSchema), async (c) => {
    const user = c.get('user');

    if (!user) {
      return c.json({ message: 'Unauthorized.' }, 401);
    }

    const { page, limit, organizationId, title } = c.req.valid('query');

    const offset = (page - 1) * limit;

    const where: SQL[] = [isNull(faqTable.deletedAt)];

    if (organizationId) {
      where.push(eq(faqTable.organizationId, organizationId));
    }

    if (title) {
      where.push(ilike(faqTable.title, `%${title}%`));
    }

    const faqs = await db.query.faqTable.findMany({
      where: and(...where),
      orderBy: desc(faqTable.createdAt),
      offset,
      limit,
    });

    const totalCount = (
      await db
        .select({ count: count() })
        .from(faqTable)
        .where(and(...where))
    )[0].count;

    const pagination = createPagination({
      page,
      limit,
      totalCount,
    });

    return c.json({ data: faqs, pagination }, 200);
  })
  //! get by faqId
  .get('/:faqId', async (c) => {
    const user = c.get('user');

    if (!user) {
      return c.json({ message: 'Unauthorized.' }, 401);
    }

    const faqId = c.req.param('faqId');

    const faq = await getFaqById(faqId);

    if (!faq) {
      return c.json({ message: 'Faq not found' }, 404);
    }

    return c.json(
      {
        data: faq,
      },
      200
    );
  })
  //! update by faqId
  .put('/:faqId', zValidator('json', updateFaqSchema), async (c) => {
    const user = c.get('user');

    if (!user) {
      return c.json({ message: 'Unauthorized.' }, 401);
    }

    const faqId = c.req.param('faqId');
    const { organizationId, title, description } = c.req.valid('json');

    const updatedFaq = await db
      .update(faqTable)
      .set({
        updaterId: user.id,
        updatedAt: new Date(),
        organizationId,
        title,
        description,
      })
      .where(eq(faqTable.id, faqId))
      .returning();

    if (updatedFaq.length === 0) {
      return c.json({ message: 'Faq not found' }, 404);
    }

    return c.json(
      {
        data: updatedFaq[0],
      },
      200
    );
  })
  //! delete by faqId
  .delete('/:faqId', async (c) => {
    const user = c.get('user');

    if (!user) {
      return c.json({ message: 'Unauthorized.' }, 401);
    }

    const faqId = c.req.param('faqId');

    const faq = await db.query.faqTable.findFirst({
      where: eq(faqTable.id, faqId),
    });

    if (!faq) {
      return c.json({ message: 'Faq not found' }, 404);
    }

    const deletedFaq = await db
      .delete(faqTable)
      .where(eq(faqTable.id, faqId))
      .returning();

    if (deletedFaq.length === 0) {
      return c.json({ message: 'Faq not found' }, 404);
    }

    return c.json(
      {
        message: 'Deleted',
      },
      200
    );
  });
