import { serveStatic } from '@hono/node-server/serve-static';
import dotenv from 'dotenv';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

import { ENV_PATH } from './constants';
import { auth } from './lib/auth';
import { createRoutes } from './routes';

dotenv.config({
  debug: true,
  path: ENV_PATH,
});

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

console.log(
  '🎉🎉🎉🎉NEXT_PUBLIC_WEB_BASE_URL =>',
  process.env.NEXT_PUBLIC_WEB_BASE_URL
);

const routes = createRoutes(app);

type AppType = typeof routes;

export { app, type AppType };
