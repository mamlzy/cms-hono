import { zValidator } from '@hono/zod-validator';
import { createId } from '@paralleldrive/cuid2';
import { db, eq } from '@repo/db';
import { organizationTable, sessionTable } from '@repo/db/schema';
import {
  createOrganizationSchema,
  setActiveOrganizationSchema,
} from '@repo/shared/schemas';
import { Hono } from 'hono';
import slugify from 'slugify';

import { jsonS } from '../../lib/hono-superjson';
import type { AuthContext } from '../../types';

export const organizationRoutes = new Hono<AuthContext>()
  //! create
  .post('/', zValidator('json', createOrganizationSchema), async (c) => {
    const user = c.get('user');

    if (!user) {
      return c.json({ message: 'Unauthorized.' }, 401);
    }

    const { name, logo, metadata } = c.req.valid('json');

    const createdOrganization = await db
      .insert(organizationTable)
      .values({
        id: createId(),
        createdAt: new Date(),
        name,
        slug: slugify(name, { lower: true }),
        logo,
        metadata,
      })
      .returning();

    return c.json(
      {
        data: createdOrganization[0],
      },
      200
    );
  })
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
  //! get active organization
  .get('/active-organization', async (c) => {
    const user = c.get('user');
    const session = c.get('session');

    if (!user || !session) {
      return c.json({ message: 'Unauthorized.' }, 401);
    }

    if (!session.activeOrganizationId) {
      return jsonS(
        c,
        {
          data: null,
        },
        200
      );
    }

    const organization = await db.query.organizationTable.findFirst({
      where: eq(organizationTable.id, session.activeOrganizationId),
    });

    if (!organization) {
      return jsonS(
        c,
        {
          data: null,
        },
        200
      );
    }

    return jsonS(
      c,
      {
        data: organization,
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
  })
  //! set active
  .post(
    '/set-active',
    zValidator('json', setActiveOrganizationSchema),
    async (c) => {
      const user = c.get('user');
      const session = c.get('session');

      if (!user || !session) {
        return c.json({ message: 'Unauthorized.' }, 401);
      }

      const { organizationId } = c.req.valid('json');

      const organization = await db.query.organizationTable.findFirst({
        where: eq(organizationTable.id, organizationId),
      });

      if (!organization) {
        return c.json({ message: 'Organization not found' }, 404);
      }

      const updatedSession = await db
        .update(sessionTable)
        .set({
          id: createId(),
          updatedAt: new Date(),
          activeOrganizationId: organization.id,
        })
        .where(eq(sessionTable.id, session.id))
        .returning();

      return c.json(
        {
          data: {
            session: updatedSession[0],
            user,
          },
        },
        200
      );
    }
  );
