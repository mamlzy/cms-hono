import { Hono } from "hono";
import {db} from '@repo/db'

export const userRoutes = new Hono()
  .get('/', async (c) => {
    const users = await db.query.userTable.findMany()

    return c.json({
      data: users
    });
  })