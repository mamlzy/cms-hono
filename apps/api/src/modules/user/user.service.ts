import { db, eq } from '@repo/db';
import { userTable, type UserCreateInput } from '@repo/db/schema';

export const getUserByEmail = async (email: string) => {
  const user = await db.query.userTable.findFirst({
    where: eq(userTable.email, email),
  });

  return user;
};

export const getUserByUsername = async (username: string) => {
  const user = await db.query.userTable.findFirst({
    where: eq(userTable.username, username),
  });

  return user;
};

export const createUser = async (user: UserCreateInput) => {
  const createdUser = await db.insert(userTable).values(user).returning();

  return createdUser[0];
};
