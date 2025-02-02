import { zValidator } from '@hono/zod-validator';
import { createId } from '@paralleldrive/cuid2';
import { getSessionToken, validateSessionToken } from '@repo/auth';
import { loginSchema, registerSchema } from '@repo/shared/schemas';
import { Hono } from 'hono';
import { deleteCookie } from 'hono/cookie';

import { hashPassword, verifyPasswordHash } from '../../lib/password';
import type { AuthContext } from '../../types';
import { createAccount } from '../account/account.service';
import { setSession } from '../session/session.service';
import {
  createUser,
  getUserByEmail,
  getUserByUsername,
} from '../user/user.service';

export const authRoutes = new Hono<AuthContext>()
  //! register
  .post('/register', zValidator('json', registerSchema), async (c) => {
    const { email, name, username, password } = c.req.valid('json');

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return c.json(
        {
          message: 'User with that email already exists.',
        },
        400
      );
    }

    const createdUser = await createUser({
      email,
      name,
      username,
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const passwordHash = await hashPassword(password);

    await createAccount({
      accountId: createId(),
      userId: createdUser.id,
      providerId: 'credential',
      password: passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await setSession(c, createdUser.id);

    return c.json({ message: 'Success' }, 201);
  })
  //! login
  .post('/login', zValidator('json', loginSchema), async (c) => {
    const { username, password } = c.req.valid('json');

    const user = await getUserByUsername(username);

    if (!user) {
      return c.json(
        {
          message: 'Username or password is incorrect',
        },
        401
      );
    }

    const isPasswordCorrect = await verifyPasswordHash(username, password);

    if (!isPasswordCorrect) {
      return c.json(
        {
          message: 'Username or password is incorrect',
        },
        401
      );
    }

    await setSession(c, user.id);

    return c.json({ message: 'Success' });
  })
  //! get session
  .get('/get-session', async (c) => {
    const sessionToken = getSessionToken(c);

    if (!sessionToken) {
      return c.json({ message: 'Unauthorized.' }, 401);
    }

    const session = await validateSessionToken(sessionToken);

    return c.json(session, 200);
  })
  //! logout
  .post('/logout', async (c) => {
    const sessionToken = getSessionToken(c);

    if (!sessionToken) {
      return c.json({ message: 'Unauthorized.' }, 401);
    }

    deleteCookie(c, 'session');

    return c.json({ message: 'Success' }, 200);
  });
