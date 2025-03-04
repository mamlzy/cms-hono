import path from 'path';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { nanoid } from 'nanoid';
import { Resend } from 'resend';
import { z } from 'zod';

import { CWD } from '../../constants';
import { writingFile } from '../../lib/utils';
import type { AuthContext } from '../../types';

const sendEmailSchema = z.object({
  html: z.string().trim().nonempty(),
});

const resendClient = new Resend(process.env.RESEND_API_KEY);

export const testRoutes = new Hono<AuthContext>()
  .get('/', (c) => {
    return c.json({
      message: 'Hello World',
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
  })
  .post('/email', zValidator('json', sendEmailSchema), async (c) => {
    const { html } = c.req.valid('json');

    const sendArray = [
      {
        subject: 'Test Aja',
        from: process.env.EMAIL_FROM!,
        to: 'imam.test.777@gmail.com',
        html,
      },
    ];

    try {
      const responses = await resendClient.batch.send(sendArray);

      return Response.json(responses);
    } catch (error) {
      return Response.json({ error });
    }
  });
