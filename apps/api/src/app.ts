import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';
import { logger } from 'hono/logger';

export const app = new Hono();

app.use('/*', cors());
app.use(logger());

export const testRoutes = new Hono().get('/', (c) => {
  return c.json({
    message: 'Hello World',
  });
});

export const routes = app.route('/test', testRoutes);

const port = 5000;

console.log(`Server is running on port http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
