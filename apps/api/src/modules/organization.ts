import type { BetterAuthContext } from '@/types';
import { db, eq } from '@repo/db';
import { organizationTable } from '@repo/db/schema';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';

export const organizationRoutes = new Hono<BetterAuthContext>()
  //! get all
  .get('/', async (c) => {
    const user = c.get('user');

    if (!user) {
      throw new HTTPException(401);
    }

    const organizations = await db.query.organizationTable.findMany();

    return c.json({
      data: organizations,
    });
  })
  //! get by org id
  .get('/:orgSlug', async (c) => {
    const user = c.get('user');

    if (!user) {
      throw new HTTPException(401);
    }

    const orgSlug = c.req.param('orgSlug');

    const organization = await db.query.organizationTable.findFirst({
      where: eq(organizationTable.slug, orgSlug),
    });

    if (!organization) {
      throw new HTTPException(404);
    }

    return c.json({
      data: organization,
    });
  });
