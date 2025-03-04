import type { Hono } from 'hono';

import { categoryRoutes } from './modules/category/category.controller';
import { customerRoutes } from './modules/customer/customer.controller';
import { faqRoutes } from './modules/faq/faq.controller';
import { folderRoutes } from './modules/folder/folder.controller';
import { mediaRoutes } from './modules/media/media.controller';
import { organizationRoutes } from './modules/organization/organization.controller';
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
    .route('/api/users', userRoutes)
    .route('/api/organizations', organizationRoutes)
    .route('/api/categories', categoryRoutes)
    .route('/api/posts', postRoutes)
    .route('/api/folders', folderRoutes)
    .route('/api/media', mediaRoutes)
    .route('/api/faqs', faqRoutes)
    .route('/api/customers', customerRoutes);

  return routes;
};
