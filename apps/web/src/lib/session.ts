import 'server-only';

import { cache } from 'react';
import { cookies } from 'next/headers';
import { validateSessionToken, type SessionValidationResult } from '@repo/auth';

export const assertAuthenticated = async () => {
  const session = await getCurrentSession();

  if (!session.user || !session.session) {
    throw new Error('You must be logged in to view this content.');
  }

  return session;
};

export const getCurrentSession = cache(async () => {
  const result = await validateRequest();

  return result;
});

export async function validateRequest(): Promise<SessionValidationResult> {
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    return { session: null, user: null };
  }
  return validateSessionToken(sessionToken);
}

//! next.js approach
export async function getSessionToken(): Promise<string | undefined> {
  const allCookies = await cookies();
  const sessionCookie = allCookies.get('session')?.value;
  return sessionCookie;
}
