import { db, eq } from '@repo/db';
import { accountTable, type AccountCreateInput } from '@repo/db/schema';

export const createAccount = async (account: AccountCreateInput) => {
  const createdAccount = await db
    .insert(accountTable)
    .values(account)
    .returning();

  return createdAccount[0];
};

export const getAccountByUserId = async (userId: string) => {
  const account = await db.query.accountTable.findFirst({
    where: eq(accountTable.userId, userId),
  });

  return account;
};
