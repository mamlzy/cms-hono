import { serveStatic } from '@hono/node-server/serve-static';
import { auth } from '@repo/auth/server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

import { createRoutes } from './routes';

const app = new Hono();

app.use(
  '*',
  cors({
    origin: [process.env.NEXT_PUBLIC_WEB_BASE_URL!],
    credentials: true,
  })
);

app.use(logger());
app.use(
  '*',
  serveStatic({
    root:
      process.env.NODE_ENV === 'production' ? './apps/api/public' : './public',
  })
);
app.on(['POST', 'GET'], '/api/auth/**', (c) => auth.handler(c.req.raw));

// console.log('CWD =>', CWD);
// console.log('ENV_PATH =>', ENV_PATH);

console.log('[APP] NODE_ENV =>', process.env.NODE_ENV);
// console.log('DATABASE_URL =>', process.env.DATABASE_URL);
// console.log('process.env =>', process.env);

const routes = createRoutes(app);

type AppType = typeof routes;

export { app, type AppType };
