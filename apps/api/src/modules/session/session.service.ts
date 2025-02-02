import { createSession, generateSessionToken } from '@repo/auth';
import type { Context } from 'hono';
import { setCookie } from 'hono/cookie';

const SESSION_COOKIE_NAME = 'session';

export async function setSessionTokenCookie(
  c: Context,
  token: string,
  expiresAt: Date
): Promise<void> {
  setCookie(c, SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    path: '/',
  });
}

export async function setSession(c: Context, userId: string) {
  const token = generateSessionToken();
  const session = await createSession(token, userId);
  setSessionTokenCookie(c, token, session.expiresAt);
}
