import { hc } from 'hono/client';

import type { AppRoute } from '../app';

const client = hc<AppRoute>('');
export type Client = typeof client;

export const hcWithType = (...args: Parameters<typeof hc>): Client =>
  hc<AppRoute>(...args);
