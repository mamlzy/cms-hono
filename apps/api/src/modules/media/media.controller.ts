import path from 'path';
import { createId } from '@paralleldrive/cuid2';
import { db, eq } from '@repo/db';
import { mediaTable } from '@repo/db/schema';
import { Hono } from 'hono';

import { CWD } from '../../constants';
import { jsonS } from '../../lib/hono-superjson';
import { deleteFile, writingFile } from '../../lib/utils';
import type { AuthContext } from '../../types';

export const mediaRoutes = new Hono<AuthContext>()
  //! get all
  .get('/', async (c) => {
    const user = c.get('user');

    if (!user) {
      return c.json({ message: 'Unauthorized.' }, 401);
    }

    const medias = await db.query.mediaTable.findMany({
      with: {
        posts: true,
      },
    });

    return jsonS(
      c,
      {
        data: medias,
      },
      200
    );
  })
  //! upload
  .post('/upload', async (c) => {
    const user = c.get('user');

    if (!user) {
      return c.json({ message: 'Unauthorized.' }, 401);
    }

    const body = await c.req.parseBody();
    const file = body.file as File;

    const fileArrayBuffer = await file.arrayBuffer();
    const fileName = `${createId()}${path.extname(file.name)}`;

    const createdMedia = await db.transaction(async (tx) => {
      const media = await tx
        .insert(mediaTable)
        .values({
          originalName: file.name,
          storedName: fileName,
          url: `/${fileName}`,
          size: file.size,
          type: file.type,
          creatorId: user.id,
        })
        .returning();

      await writingFile(
        path.join(CWD, 'public/media'),
        fileName,
        Buffer.from(fileArrayBuffer)
      );

      return media[0];
    });

    return c.json(
      {
        data: createdMedia,
      },
      200
    );
  })
  //! delete by mediaId
  .delete('/:mediaId', async (c) => {
    const user = c.get('user');

    if (!user) {
      return c.json({ message: 'Unauthorized.' }, 401);
    }

    const mediaId = c.req.param('mediaId');

    await db.transaction(async (tx) => {
      const deletedMedia = await tx
        .delete(mediaTable)
        .where(eq(mediaTable.id, mediaId))
        .returning();

      if (deletedMedia.length === 0) {
        return c.json({ message: 'Media not found' }, 404);
      }

      const filePath = path.join(CWD, 'public/media', deletedMedia[0].url);

      await deleteFile(filePath);

      return deletedMedia[0];
    });

    return c.json(
      {
        message: 'Deleted',
      },
      200
    );
  });
