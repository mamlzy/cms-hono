import type { Hono } from 'hono';

import { authRoutes } from './modules/auth/auth.controller';
import { categoryRoutes } from './modules/category/category.controller';
import { customerRoutes } from './modules/customer/customer.controller';
import { faqRoutes } from './modules/faq/faq.controller';
import { mediaRoutes } from './modules/media/media.controller';
import { organizationRoutes } from './modules/organizaiton/organization.controller';
import { postRoutes } from './modules/post/post.controller';
import { testRoutes } from './modules/test/test.controller';
import { userRoutes } from './modules/user/user.controller';
import type { AuthContext } from './types';

export const createRoutes = (app: Hono<AuthContext>) => {
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
    .route('/api/auth', authRoutes)
    .route('/api/users', userRoutes)
    .route('/api/organizations', organizationRoutes)
    .route('/api/categories', categoryRoutes)
    .route('/api/posts', postRoutes)
    .route('/api/media', mediaRoutes)
    .route('/api/faqs', faqRoutes)
    .route('/api/customers', customerRoutes);

  return routes;
};
