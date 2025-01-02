import { cors } from '@elysiajs/cors';
import { node } from '@elysiajs/node';
import { swagger } from '@elysiajs/swagger';
import { db } from '@repo/db';
import { Elysia } from 'elysia';

import { betterAuthView } from './libs/auth';

// import { userMiddleware } from './middlewares/auth-middleware';

const app = new Elysia({ adapter: node() })
  .use(cors())
  .use(swagger())
  // .derive(userMiddleware)
  .all('/api/auth/*', betterAuthView)
  .get('/', async () => {
    return {
      message: 'Hello',
    };
  })
  .get('/api', async () => {
    return { message: 'Hello from API' };
  })
  .post('/api/users', async () => {
    console.log(
      'process.env.NEXT_PUBLIC_WEB_BASE_URL =>',
      process.env.NEXT_PUBLIC_WEB_BASE_URL
    );
    const users = await db.query.userTable.findMany();

    return users;
  });

app.listen(5000);

console.log(`🦊 Elysia is running at http://localhost:${process.env.PORT}`);

export type App = typeof app;
