import type { Session, User } from '@repo/db/schema';

export type AuthContext = {
  Variables: {
    user: User | null;
    session: Session | null;
  };
};
