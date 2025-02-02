import { authRequest } from '@/requests/auth.request';
import { useMutation } from '@tanstack/react-query';

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: authRequest.logout,
  });
};
