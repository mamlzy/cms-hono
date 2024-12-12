import dotenv from 'dotenv';

import { Logger } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';

import * as schema from './schema';

import postgres from 'postgres'
import { ENV_PATH } from './constant';

dotenv.config({
  debug: true,
  path: ENV_PATH,
})

class QueryLogger implements Logger {
  // eslint-disable-next-line class-methods-use-this
  logQuery(query: string, params: unknown[]): void {
    console.debug('___QUERY___');
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
