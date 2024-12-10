import { Hono } from 'hono';
import { testRoutes } from './modules/test';
import { userRoutes } from './modules/user';

export const createRoutes = (app: Hono) => {
  const routes = app.route('/api/test', testRoutes).route('/api/users', userRoutes);

  return routes;
};
