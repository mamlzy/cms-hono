import dotenv from 'dotenv';
import { app } from './app';
import { serve } from '@hono/node-server';
import {  ENV_PATH } from './constants';

dotenv.config({
  debug: true,
  path: ENV_PATH,
});

const PORT = process.env.PORT! as unknown as number;

console.log(`Server is running on port http://localhost:${PORT}`);
console.log("NODE_ENV =>", process.env.NODE_ENV)

serve({
  fetch: app.fetch,
  port: PORT,
});
