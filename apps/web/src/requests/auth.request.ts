import type { LoginSchema, RegisterSchema } from '@repo/shared/schemas';

import { hcs } from '@/lib/hono-client';

const register = async (payload: RegisterSchema) => {
  const data = await hcs.api.auth.register.$post({
    json: payload,
  });

  return data;
};

const login = async (payload: LoginSchema) => {
  const data = await hcs.api.auth.login.$post({
    json: payload,
  });

  return data;
};

const logout = async () => {
  const res = await hcs.api.auth.logout.$post();

  return res.json();
};

export const getSession = async () => {
  const res = await hcs.api.auth['get-session'].$get();

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  const session = await res.json();

  return session;
};

export const authRequest = {
  register,
  login,
  logout,
  getSession,
};
