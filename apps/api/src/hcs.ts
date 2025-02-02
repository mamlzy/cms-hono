import { hc } from 'hono/client';
import superjson from 'superjson';

export type { AppRoute } from './app';

export type Callback = (opts: { path: string[]; args: any[] }) => unknown;

const createProxy = (callback: Callback, path: string[]) => {
  const proxy: unknown = new Proxy(() => {}, {
    get(_obj, key) {
      if (typeof key !== 'string' || key === 'then') {
        return undefined;
      }
      return createProxy(callback, [...path, key]);
    },
    apply(_1, _2, args) {
      return callback({
        path,
        args,
      });
    },
  });
  return proxy;
};

export const hcsWithType: typeof hc = (baseUrl, options) =>
  createProxy(({ path, args }) => {
    let client: any = hc(baseUrl, options);

    for (const part of path) {
      client = client[part];
    }

    const result = client(...args);

    if (result instanceof Promise) {
      return result.then(async (res) => {
        if (
          res instanceof Response &&
          res.headers.get('x-superjson') === 'true'
        ) {
          res.json = async () => {
            const text = await res.text();
            return superjson.parse(text);
          };
        }
        return res;
      });
    }

    return result;
  }, []) as any;
