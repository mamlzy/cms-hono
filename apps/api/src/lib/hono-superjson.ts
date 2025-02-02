import type { Context, TypedResponse } from 'hono';
import type { ResponseHeader } from 'hono/utils/headers';
import type { ContentfulStatusCode, StatusCode } from 'hono/utils/http-status';
import type { BaseMime } from 'hono/utils/mime';
import { SuperJSON } from 'superjson';

type SuperJSONValue = Parameters<typeof SuperJSON.stringify>[0];

type ResponseHeadersInit =
  | [string, string][]
  | Record<'Content-Type', BaseMime>
  | Record<ResponseHeader, string>
  | Record<string, string>
  | Headers;

type ResponseInit<T extends StatusCode = StatusCode> = {
  headers?: ResponseHeadersInit;
  status?: T;
  statusText?: string;
};

type ResponseOrInit<T extends StatusCode = StatusCode> =
  | ResponseInit<T>
  | Response;

type HeaderRecord =
  | Record<'Content-Type', BaseMime>
  | Record<ResponseHeader, string | string[]>
  | Record<string, string | string[]>;

type SuperJSONRespondReturn<
  T extends SuperJSONValue,
  U extends ContentfulStatusCode,
> = Response & TypedResponse<T, U, 'json'>;

export const jsonS = <
  T extends SuperJSONValue,
  U extends ContentfulStatusCode = ContentfulStatusCode,
>(
  c: Context,
  object: T,
  arg?: U | ResponseOrInit<U>,
  headers?: HeaderRecord
): SuperJSONRespondReturn<T, U> => {
  const body = SuperJSON.stringify(object);
  c.header('content-type', 'application/json; charset=UTF-8');
  c.header('x-superjson', 'true');
  return (
    typeof arg === 'number'
      ? c.newResponse(body, arg, headers)
      : c.newResponse(body, arg)
  ) as any;
};
