export const CWD =
  process.env.NODE_ENV === 'production' ? `./packages/db` : '.';

export const ENV_PATH = `${CWD}/${process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development'}`;
