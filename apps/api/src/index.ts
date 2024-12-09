import { app } from './app';
import { serve } from '@hono/node-server';

const port = 5000;

console.log(`Server is running on port http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
