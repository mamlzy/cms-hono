import path from 'path';
import { jsonS } from '@/hono-superjson';
import type { BetterAuthContext } from '@/types';
import { Hono } from 'hono';
import { nanoid } from 'nanoid';

import { CWD } from '../constants';
import { writingFile } from '../lib/utils';

export const testRoutes = new Hono<BetterAuthContext>()
  .get('/', (c) => {
    return jsonS(c, {
      date: new Date(),
    });
  })
  .post('/', async (c) => {
    const body = await c.req.parseBody({ all: true });
    console.log('body =>', body);
    const files = body.files as File[];

    for (const file of files) {
      const arr = await file.arrayBuffer();
      const fileName = `${nanoid(5)}-${path.extname(file.name)}`;

      try {
        await writingFile(path.join(CWD, 'public'), fileName, Buffer.from(arr));
      } catch (e) {
        return c.json({ error: e?.toString() }, 500);
      }
    }

    return c.json({
      message: 'Hit',
    });
  });
