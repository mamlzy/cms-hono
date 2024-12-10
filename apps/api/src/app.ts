import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { createRoutes } from './routes';

const app = new Hono();

app.use('/*', cors());
app.use(logger());

const routes = createRoutes(app);

type AppType = typeof routes;

export { app, AppType };
