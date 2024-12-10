import 'dotenv/config';

import { Logger } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';

import * as schema from './schema';

class QueryLogger implements Logger {
  // eslint-disable-next-line class-methods-use-this
  logQuery(query: string, params: unknown[]): void {
    console.debug('___QUERY___');
    console.debug(query);
    console.debug(params);
    console.debug('___END_QUERY___');
  }
}

export const db = drizzle(process.env.DATABASE_URL!, {
  casing: 'snake_case',
  logger: new QueryLogger(),
  schema,
});

export * from 'drizzle-orm';
