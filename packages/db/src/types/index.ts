import type {
  BuildQueryResult,
  DBQueryConfig,
  ExtractTablesWithRelations,
} from 'drizzle-orm';

// import type { Exact } from 'type-fest';

import * as schema from '../schema';

export * from './category.type';

// type TSchema = ExtractTablesWithRelations<typeof schema>;

// type QueryConfig<TableName extends keyof TSchema> = DBQueryConfig<
//   'one' | 'many',
//   boolean,
//   TSchema,
//   TSchema[TableName]
// >;

// export type InferQueryModel<
//   TableName extends keyof TSchema,
//   QBConfig extends Exact<QueryConfig<TableName>, QBConfig> = {}, // <-- notice Exact here
// > = BuildQueryResult<TSchema, TSchema[TableName], QBConfig>;

type Schema = typeof schema;
type TablesWithRelations = ExtractTablesWithRelations<Schema>;

export type IncludeRelation<TableName extends keyof TablesWithRelations> =
  DBQueryConfig<
    'one' | 'many',
    boolean,
    TablesWithRelations,
    TablesWithRelations[TableName]
  >['with'];

export type IncludeColumns<TableName extends keyof TablesWithRelations> =
  DBQueryConfig<
    'one' | 'many',
    boolean,
    TablesWithRelations,
    TablesWithRelations[TableName]
  >['columns'];

export type InferQueryModel<
  TableName extends keyof TablesWithRelations,
  With extends IncludeRelation<TableName> | undefined = undefined,
  Columns extends IncludeColumns<TableName> | undefined = undefined,
> = {
  [K in keyof BuildQueryResult<
    TablesWithRelations,
    TablesWithRelations[TableName],
    {
      columns: Columns;
      with: With;
    }
  >]: K extends keyof With
    ? With[K] extends { __optional: true }
      ?
          | BuildQueryResult<
              TablesWithRelations,
              TablesWithRelations[TableName],
              {
                columns: Columns;
                with: With;
              }
            >[K]
          | undefined
      : BuildQueryResult<
          TablesWithRelations,
          TablesWithRelations[TableName],
          {
            columns: Columns;
            with: With;
          }
        >[K]
    : BuildQueryResult<
        TablesWithRelations,
        TablesWithRelations[TableName],
        {
          columns: Columns;
          with: With;
        }
      >[K];
};
