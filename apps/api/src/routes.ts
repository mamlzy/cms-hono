import type { Hono } from 'hono';

import { categoryRoutes } from './modules/category';
import { organizationRoutes } from './modules/organization';
import { testRoutes } from './modules/test';
import { userRoutes } from './modules/user';
import type { BetterAuthContext } from './types';

export const createRoutes = (app: Hono<BetterAuthContext>) => {
  const routes = app
    .get('/', (c) => {
      return c.json({
        message: 'OK ✅',
      });
    })
    .get('/api', (c) => {
      return c.json({
        message: 'API OK ✅',
      });
    })
    .route('/api/test', testRoutes)
    .route('/api/users', userRoutes)
    .route('/api/organizations', organizationRoutes)
    .route('/api/categories', categoryRoutes);

  return routes;
};
