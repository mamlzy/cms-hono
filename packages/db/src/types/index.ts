import type {
  BuildQueryResult,
  DBQueryConfig,
  ExtractTablesWithRelations,
} from 'drizzle-orm';
import type { Exact } from 'type-fest';

import type * as schema from '../schema';

export * from './category.type';

type TSchema = ExtractTablesWithRelations<typeof schema>;

type QueryConfig<TableName extends keyof TSchema> = DBQueryConfig<
  'one' | 'many',
  boolean,
  TSchema,
  TSchema[TableName]
>;

export type InferQueryModel<
  TableName extends keyof TSchema,
  QBConfig extends Exact<QueryConfig<TableName>, QBConfig> = {}, // <-- notice Exact here
> = BuildQueryResult<TSchema, TSchema[TableName], QBConfig>;
