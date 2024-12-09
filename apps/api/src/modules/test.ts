import { Hono } from 'hono';
import path from 'path';
import { nanoid } from 'nanoid';
import { writingFile } from '@/lib/utils';

export const testRoutes = new Hono()
  .get('/', (c) => {
    return c.json({
      message: 'Hello World',
    });
  })
  .post('/', async (c) => {
    const body = await c.req.parseBody({ all: true });
    const files = body['files'] as File[];

    for (const file of files) {
      const arr = await file.arrayBuffer();
      const fileName = `${nanoid(5)}-${path.extname(file.name)}`;

      try {
        await writingFile(
          path.join(process.cwd(), 'public'),
          fileName,
          Buffer.from(arr),
        );
      } catch (e) {
        return c.json({ error: e?.toString() }, 500);
      }
    }

    return c.json({
      message: 'Hit',
    });
  });
