import { zValidator } from '@hono/zod-validator';
import { and, count, db, desc, eq, ilike, isNull, type SQL } from '@repo/db';
import { customerTable } from '@repo/db/schema';
import { createPagination } from '@repo/shared/lib/utils';
import {
  createCustomerSchema,
  queryCustomerSchema,
  updateCustomerSchema,
} from '@repo/shared/schemas';
import { Hono } from 'hono';

import { jsonS } from '../../lib/hono-superjson';
import type { AuthContext } from '../../types';

export const customerRoutes = new Hono<AuthContext>()
  //! create
  .post('/', zValidator('json', createCustomerSchema), async (c) => {
    const user = c.get('user');

    if (!user) {
      return c.json({ message: 'Unauthorized.' }, 401);
    }

    const body = c.req.valid('json');

    const { name, organizationId, thumbnailMediaId } = body;

    const createdCustomer = await db
      .insert(customerTable)
      .values({
        organizationId,
        creatorId: user.id,
        name,
        thumbnailMediaId,
      })
      .returning();

    return c.json(
      {
        data: createdCustomer[0],
      },
      200
    );
  })
  //! get all
  .get('/', zValidator('query', queryCustomerSchema), async (c) => {
    const user = c.get('user');

    if (!user) {
      return c.json({ message: 'Unauthorized.' }, 401);
    }

    const { page, limit, organizationId, name } = c.req.valid('query');

    const offset = (page - 1) * limit;

    const where: SQL[] = [isNull(customerTable.deletedAt)];

    if (organizationId) {
      where.push(eq(customerTable.organizationId, organizationId));
    }
    if (name) {
      where.push(ilike(customerTable.name, `%${name}%`));
    }

    const customers = await db.query.customerTable.findMany({
      where: and(...where),
      with: {
        thumbnailMedia: true,
      },
      orderBy: desc(customerTable.createdAt),
      offset,
      limit,
    });

    const totalCount = (
      await db
        .select({ count: count() })
        .from(customerTable)
        .where(and(...where))
    )[0].count;

    const pagination = createPagination({
      page,
      limit,
      totalCount,
    });

    return c.json({ data: customers, pagination }, 200);
  })
  //! get by id
  .get('/:customerId', async (c) => {
    const user = c.get('user');

    if (!user) {
      return c.json({ message: 'Unauthorized.' }, 401);
    }

    const customerId = c.req.param('customerId');

    const customer = await db.query.customerTable.findFirst({
      where: eq(customerTable.id, customerId),
      with: {
        thumbnailMedia: true,
      },
    });

    if (!customer) {
      return c.json({ message: 'Customer not found' }, 404);
    }

    return jsonS(c, { data: customer }, 200);
  })
  //! update by id
  .put('/:customerId', zValidator('json', updateCustomerSchema), async (c) => {
    const user = c.get('user');

    if (!user) {
      return c.json({ message: 'Unauthorized.' }, 401);
    }

    const customerId = c.req.param('customerId');
    const body = c.req.valid('json');
    const { name, thumbnailMediaId } = body;

    const customer = await db.query.customerTable.findFirst({
      where: eq(customerTable.id, customerId),
    });

    if (!customer) {
      return c.json({ message: 'Customer not found' }, 404);
    }

    //! update customer
    const updatedCustomer = await db
      .update(customerTable)
      .set({
        updaterId: user.id,
        name,
        thumbnailMediaId,
      })
      .where(eq(customerTable.id, customerId))
      .returning();

    return c.json(
      {
        data: updatedCustomer,
      },
      200
    );
  })
  //! delete by id
  .delete('/:customerId', async (c) => {
    const user = c.get('user');

    if (!user) {
      return c.json({ message: 'Unauthorized.' }, 401);
    }

    const customerId = c.req.param('customerId');

    //! delete customer
    const deletedCustomer = await db
      .delete(customerTable)
      .where(eq(customerTable.id, customerId))
      .returning();

    if (deletedCustomer.length === 0) {
      return c.json({ message: 'Customer not found' }, 404);
    }

    return c.json(
      {
        message: 'Customer Deleted',
        data: deletedCustomer,
      },
      200
    );
  });
