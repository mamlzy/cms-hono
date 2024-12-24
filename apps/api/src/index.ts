import { node } from '@elysiajs/node';
import { db } from '@repo/db';
import { Elysia } from 'elysia';

const app = new Elysia({ adapter: node() })
  .get('/', async () => {
    const users = await db.query.userTable.findMany();

    return users;
  })
  .listen(5000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
