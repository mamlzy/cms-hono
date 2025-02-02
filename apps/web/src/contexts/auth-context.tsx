'use client';

import { createContext, useEffect, useState } from 'react';
import { authRequest } from '@/requests/auth.request';
import { createStore, type StoreApi } from 'zustand';

import type { AuthStore } from '@/types/auth.type';
import { useAuthStore } from '@/hooks/use-auth-store';
import { useSession } from '@/hooks/use-session';

export const AuthContext = createContext<StoreApi<AuthStore> | null>(null);

export const getSession = async ({
  setSession,
}: {
  setSession: AuthStore['setSession'];
}) => {
  try {
    const session = await authRequest.getSession();

    if (!session.session || !session.user) {
      throw new Error('Invalid session');
    }

    setSession(session);
  } catch (err) {
    console.log('err =>', err);
    // router.replace('/login');
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [store] = useState(() =>
    createStore<AuthStore>((set) => ({
      session: null,
      user: null,
      setSession: (session) =>
        set(() => ({ session: session.session, user: session.user })),
      // removeAllBears: () => set({ bears: 0 }),
    }))
  );

  return (
    <AuthContext value={store}>
      <SessionLoaderProvider>{children}</SessionLoaderProvider>
    </AuthContext>
  );
};

const SessionLoaderProvider = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  const setSession = useAuthStore((state) => state.setSession);

  useEffect(() => {
    if (!session.user?.id) {
      getSession({ setSession });
    }
  });

  return children;
};
