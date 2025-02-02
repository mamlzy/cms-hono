import type { Session, User } from '@repo/db/schema';

type RequiredSession = Omit<
  Session,
  'expiresAt' | 'createdAt' | 'updatedAt'
> & {
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
};

type RequiredUser = Omit<User, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
};

export type AuthStore = {
  session: RequiredSession | null;
  user: RequiredUser | null;
  setSession: ({
    session,
    user,
  }: {
    session: RequiredSession;
    user: RequiredUser;
  }) => void;
};
