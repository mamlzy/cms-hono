import { Logger } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from './schema';

class QueryLogger implements Logger {
  // eslint-disable-next-line class-methods-use-this
  logQuery(query: string, params: unknown[]): void {
    console.debug('___QUERY___');
    console.log('process.env.DATABASE_URL =>', process.env.DATABASE_URL);
    console.debug(query);
    console.debug(params);
    console.debug('___END_QUERY___');
  }
}

const client = postgres(process.env.DATABASE_URL!);

export const db = drizzle({
  client,
  casing: 'snake_case',
  logger: new QueryLogger(),
  schema,
});

export * from 'drizzle-orm';
