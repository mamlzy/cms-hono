import { Hono } from 'hono';
import { testRoutes } from './modules/test';

export const createRoutes = (app: Hono) => {
  const routes = app.route('/api/test', testRoutes);

  return routes;
};
