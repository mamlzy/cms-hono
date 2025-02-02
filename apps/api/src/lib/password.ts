import { hash, verify } from '@node-rs/argon2';
import { db, eq } from '@repo/db';
import { userTable } from '@repo/db/schema';

import { getAccountByUserId } from '../modules/account/account.service';

export async function hashPassword(password: string): Promise<string> {
  return hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
}

export async function verifyPasswordHash(
  username: string,
  plainTextPassword: string
): Promise<boolean> {
  const user = await db.query.userTable.findFirst({
    where: eq(userTable.username, username),
  });

  if (!user) {
    return false;
  }

  const account = await getAccountByUserId(user.id);

  if (!account) {
    return false;
  }

  return verify(account.password!, plainTextPassword);
}
