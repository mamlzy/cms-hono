import { db } from '@repo/db';
import { Hono } from 'hono';

import type { AuthContext } from '../../types';

export const userRoutes = new Hono<AuthContext>().get('/', async (c) => {
  const user = c.get('user');

  if (!user) {
    return c.json({ message: 'Unauthorized' }, 401);
  }

  const users = await db.query.userTable.findMany();

  return c.json(
    {
      data: users,
    },
    200
  );
});
