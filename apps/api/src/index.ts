import { serve } from '@hono/node-server';

import { app } from './app';

const PORT = process.env.PORT! as unknown as number;

console.log(`Server is running on port http://localhost:${PORT}`);

serve({
  fetch: app.fetch,
  port: PORT,
});
