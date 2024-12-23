import path from 'path';

export const CWD =
  process.env.NODE_ENV === 'production'
    ? path.join(process.cwd(), 'apps', 'api')
    : process.cwd();

export const ENV_PATH = path.join(
  CWD,
  process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development'
);
