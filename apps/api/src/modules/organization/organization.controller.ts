import { db, eq } from '@repo/db';
import { organizationTable } from '@repo/db/schema';
import { Hono } from 'hono';

import { jsonS } from '../../lib/hono-superjson';
import type { AuthContext } from '../../types';

export const organizationRoutes = new Hono<AuthContext>()
  //! get all
  .get('/', async (c) => {
    const user = c.get('user');

    if (!user) {
      return c.json({ message: 'Unauthorized.' }, 401);
    }

    const organizations = await db.query.organizationTable.findMany();

    return jsonS(
      c,
      {
        data: organizations,
      },
      200
    );
  })
  //! get by id
  .get('/id/:organizationId', async (c) => {
    const user = c.get('user');

    if (!user) {
      return c.json({ message: 'Unauthorized.' }, 401);
    }

    const organizationId = c.req.param('organizationId');

    const organization = await db.query.organizationTable.findFirst({
      where: eq(organizationTable.id, organizationId),
    });

    if (!organization) {
      return c.json({ message: 'Organization not found' }, 404);
    }

    return c.json(
      {
        data: organization,
      },
      200
    );
  })
  //! get by slug
  .get('/slug/:organizationSlug', async (c) => {
    const user = c.get('user');

    if (!user) {
      return c.json({ message: 'Unauthorized.' }, 401);
    }

    const organizationSlug = c.req.param('organizationSlug');

    const organization = await db.query.organizationTable.findFirst({
      where: eq(organizationTable.slug, organizationSlug),
    });

    if (!organization) {
      return c.json({ message: 'Organization not found' }, 404);
    }

    return c.json(
      {
        data: organization,
      },
      200
    );
  });
