import { useShallow } from 'zustand/react/shallow';

import { useAuthStore } from './use-auth-store';

export const useSession = () =>
  useAuthStore(
    useShallow((state) => ({ session: state.session, user: state.user }))
  );
