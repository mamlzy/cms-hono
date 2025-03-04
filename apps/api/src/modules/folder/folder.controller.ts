import { zValidator } from '@hono/zod-validator';
import { and, count, db, desc, eq, ilike, isNull, SQL } from '@repo/db';
import { folderTable } from '@repo/db/schema';
import { createPagination } from '@repo/shared/lib/utils';
import { createFolderSchema, qsFolderSchema } from '@repo/shared/schemas';
import { Hono } from 'hono';
import slugify from 'slugify';

import type { AuthContext } from '../../types';
import { getFolderById } from './folder.service';

export const folderRoutes = new Hono<AuthContext>()
  //! create
  .post('/', zValidator('json', createFolderSchema), async (c) => {
    const user = c.get('user');

    if (!user) {
      return c.json({ message: 'Unauthorized.' }, 401);
    }

    const { name, organizationId } = c.req.valid('json');
    const slug = slugify(name, { lower: true });

    const existingFolder = await db.query.folderTable.findFirst({
      where: eq(folderTable.slug, slug),
    });

    if (existingFolder) {
      return c.json(
        {
          message: 'Folder with that name already exists.',
        },
        400
      );
    }

    const createdFolder = await db
      .insert(folderTable)
      .values({
        creatorId: user.id,
        name,
        slug,
        organizationId,
      })
      .returning();

    return c.json(
      {
        data: createdFolder[0],
      },
      200
    );
  })
  //! get all
  .get('/', zValidator('query', qsFolderSchema), async (c) => {
    const user = c.get('user');

    if (!user) {
      return c.json({ message: 'Unauthorized.' }, 401);
    }

    const { page, limit, id, name } = c.req.valid('query');

    const offset = (page - 1) * limit;

    const where: SQL[] = [isNull(folderTable.deletedAt)];

    if (id && id !== 'root') {
      where.push(eq(folderTable.id, `%${id}%`));
    }
    if (name) {
      where.push(ilike(folderTable.name, `%${name}%`));
    }

    const folders = await db.query.folderTable.findMany({
      where: and(...where),
      orderBy: desc(folderTable.createdAt),
      offset,
      limit,
    });

    const totalCount = (
      await db
        .select({ count: count() })
        .from(folderTable)
        .where(and(...where))
    )[0].count;

    const pagination = createPagination({
      page,
      limit,
      totalCount,
    });

    return c.json({ data: folders, pagination }, 200);
  })
  //! get by folder id
  .get('/id/:folderId', async (c) => {
    const user = c.get('user');

    if (!user) {
      return c.json({ message: 'Unauthorized.' }, 401);
    }

    const folderId = c.req.param('folderId');

    const folder = await getFolderById(folderId);

    if (!folder) {
      return c.json({ message: 'Folder not found' }, 404);
    }

    return c.json(
      {
        data: folder,
      },
      200
    );
  });
