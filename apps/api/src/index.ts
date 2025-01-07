import { serve } from '@hono/node-server';

import { app } from './app';

const PORT = process.env.API_PORT! as unknown as number;

console.log(`Server is running on port http://localhost:${PORT}`);
console.log('[INDEX] NODE_ENV =>', process.env.NODE_ENV);
// console.log('DATABASE_URL =>', process.env.DATABASE_URL);

serve({
  fetch: app.fetch,
  port: PORT,
});
