import { db } from '@repo/db';
import { Hono } from 'hono';

export const userRoutes = new Hono().get('/', async (c) => {
  const users = await db.query.userTable.findMany();

  return c.json({
    data: users,
  });
});
