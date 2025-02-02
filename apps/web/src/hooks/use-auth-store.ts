import { use } from 'react';
import { AuthContext } from '@/contexts/auth-context';
import { useStore } from 'zustand';

import type { AuthStore } from '@/types/auth.type';

export const useAuthStore = <T>(selector: (state: AuthStore) => T) => {
  const store = use(AuthContext);
  if (!store) {
    throw new Error('Missing AuthProvider');
  }

  return useStore(store, selector);
};
