import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { createRoutes } from './routes';
import { serveStatic } from '@hono/node-server/serve-static'

const app = new Hono();

app.use('/*', cors());
app.use(logger());
app.use('*', serveStatic({ root: process.env.NODE_ENV === 'production' ? './apps/api/public' : './public' })) 


const routes = createRoutes(app);

type AppType = typeof routes;

export { app, type AppType };
