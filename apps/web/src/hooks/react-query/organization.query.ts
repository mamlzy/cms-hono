import { organizationRequest } from '@/requests/organization.request';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuthStore } from '../use-auth-store';

export const useCreateOrganizationMutation = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: organizationRequest.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['organizations'] });
    },
  });
};

export const useListOrganizations = () => {
  return useQuery({
    queryKey: ['organizations'],
    queryFn: organizationRequest.getAll,
  });
};

export const useSetActiveOrganizationMutation = () => {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: organizationRequest.setActiveOrganization,
    onSuccess: ({ session, user }) => {
      setSession({ session, user });
    },
  });
};

export const useActiveOrganization = () => {
  return useQuery({
    queryKey: ['organizations', 'active'],
    queryFn: organizationRequest.getActiveOrganization,
  });
};
