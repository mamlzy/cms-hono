import fs from 'fs/promises';
import path from 'path';
import { zValidator } from '@hono/zod-validator';
import { createId } from '@paralleldrive/cuid2';
import { and, db, eq, ilike, isNull, SQL } from '@repo/db';
import { mediaTable } from '@repo/db/schema';
import {
  createMediaSchema,
  deleteMediaSchema,
  qsMediaSchema,
} from '@repo/shared/schemas';
import { Hono } from 'hono';

import { CWD } from '../../constants';
import { jsonS } from '../../lib/hono-superjson';
import { deleteFile, writingFile } from '../../lib/utils';
import type { AuthContext } from '../../types';

export const mediaRoutes = new Hono<AuthContext>()
  //! get all
  .get('/', zValidator('query', qsMediaSchema), async (c) => {
    const user = c.get('user');

    if (!user) {
      return c.json({ message: 'Unauthorized.' }, 401);
    }

    const { folderId, name } = c.req.valid('query');

    const where: SQL[] = [isNull(mediaTable.deletedAt)];

    if (folderId) {
      if (folderId === 'root') {
        where.push(isNull(mediaTable.folderId));
      } else {
        where.push(eq(mediaTable.folderId, folderId));
      }
    }

    if (name) {
      where.push(ilike(mediaTable.originalName, `%${name}%`));
    }

    const medias = await db.query.mediaTable.findMany({
      where: and(...where),
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
  .post('/upload', zValidator('form', createMediaSchema), async (c) => {
    const user = c.get('user');

    if (!user) {
      return c.json({ message: 'Unauthorized.' }, 401);
    }

    const { file, folderId, organizationId } = c.req.valid('form');

    const fileArrayBuffer = await file.arrayBuffer();
    const fileName = `${createId()}${path.extname(file.name)}`;

    const createdMedia = await db.transaction(async (tx) => {
      const media = await tx
        .insert(mediaTable)
        .values({
          folderId,
          originalName: file.name,
          storedName: fileName,
          url: `/${fileName}`,
          size: file.size,
          type: file.type,
          creatorId: user.id,
        })
        .returning();

      const tempPathArray = ['public', 'media', `${organizationId}`];

      if (folderId) {
        tempPathArray.push(folderId);
      }

      await writingFile(
        path.join(CWD, ...tempPathArray),
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
  .delete('/:mediaId', zValidator('json', deleteMediaSchema), async (c) => {
    const user = c.get('user');

    if (!user) {
      return c.json({ message: 'Unauthorized.' }, 401);
    }

    const mediaId = c.req.param('mediaId');
    const { organizationId, folderId } = c.req.valid('json');

    await db.transaction(async (tx) => {
      const deletedMedia = await tx
        .delete(mediaTable)
        .where(eq(mediaTable.id, mediaId))
        .returning();

      if (deletedMedia.length === 0) {
        return c.json({ message: 'Media not found' }, 404);
      }

      const tempPathArray = ['public', 'media', `${organizationId}`];

      if (folderId && folderId !== 'root') {
        tempPathArray.push(folderId);
      }

      tempPathArray.push(deletedMedia[0].url);

      const filePath = path.join(CWD, ...tempPathArray);

      await deleteFile(filePath);

      // Check if folder exists and is empty (except root folder)
      if (folderId && folderId !== 'root') {
        // Check if there are any other files in the folder
        const remainingFiles = await tx.query.mediaTable.findMany({
          where: and(
            eq(mediaTable.folderId, folderId),
            isNull(mediaTable.deletedAt)
          ),
          limit: 1,
        });

        // If no files left in folder, delete the folder
        if (remainingFiles.length === 0) {
          // Remove the file name from the path to get folder path
          const folderPath = path.join(CWD, ...tempPathArray.slice(0, -1));

          try {
            // Check if directory is empty
            const items = await fs.readdir(folderPath);

            if (items.length === 0) {
              await fs.rmdir(folderPath);
            }
          } catch (err) {
            console.log('err =>', err);
            return c.json(
              { message: 'Error checking/removing empty folder' },
              404
            );
          }
        }
      }

      return deletedMedia[0];
    });

    return c.json(
      {
        message: 'Deleted',
      },
      200
    );
  });
