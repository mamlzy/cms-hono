import { serveStatic } from '@hono/node-server/serve-static';
import { getSessionToken, validateSessionToken } from '@repo/auth';
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

//! auth middldeware
app.use('/api/*', async (c, next) => {
  const sessionToken = getSessionToken(c);

  if (!sessionToken) {
    c.set('user', null);
    c.set('session', null);

    return next();
  }

  const session = await validateSessionToken(sessionToken);

  if (!session.session || !session.user) {
    c.set('user', null);
    c.set('session', null);

    return next();
  }

  c.set('user', session.user);
  c.set('session', session.session);

  return next();
});

const routes = createRoutes(app);

type AppRoute = typeof routes;

export { app, type AppRoute };
