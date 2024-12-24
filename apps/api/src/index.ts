import { cors } from '@elysiajs/cors';
import { node } from '@elysiajs/node';
import { swagger } from '@elysiajs/swagger';
import { db } from '@repo/db';
import { Elysia } from 'elysia';

import betterAuthView from './libs/auth';
import { userMiddleware } from './middlewares/auth-middleware';

const app = new Elysia({ adapter: node() })
  .use(
    cors({
      origin: ['http://localhost:3000'],
    })
  )
  // .use(swagger())
  // .derive(userMiddleware)
  .all('/api/auth/*', betterAuthView)
  .get('/', async () => {
    const users = await db.query.userTable.findMany();

    return users;
  })
  .listen(5000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

export type App = typeof app;
