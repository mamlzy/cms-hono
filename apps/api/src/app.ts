import { serveStatic } from '@hono/node-server/serve-static';
import { auth } from '@repo/auth/server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

import { createRoutes } from './routes';
import type { AuthContext } from './types';

const app = new Hono<AuthContext>();

app.use(
  '*',
  cors({
    origin: [process.env.NEXT_PUBLIC_WEB_BASE_URL!],
    credentials: true,
    exposeHeaders: ['x-superjson'],
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

//! auth middleware
app.use('*', async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set('user', null);
    c.set('session', null);
    return next();
  }

  c.set('user', session.user);
  c.set('session', session.session);
  return next();
});

app.on(['POST', 'GET'], '/api/auth/**', (c) => auth.handler(c.req.raw));

const routes = createRoutes(app);

type AppRoute = typeof routes;

export { app, type AppRoute };
