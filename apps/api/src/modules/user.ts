import type { BetterAuthContext } from '@/types';
import { db } from '@repo/db';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';

export const userRoutes = new Hono<BetterAuthContext>().get('/', async (c) => {
  const user = c.get('user');

  if (!user) {
    throw new HTTPException(401);
  }

  const users = await db.query.userTable.findMany();

  return c.json({
    data: users,
  });
});
