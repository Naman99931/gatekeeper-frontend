import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { organizationApi } from '@/lib/api/organizations';
import { CreateOrganizationRequest } from '@/types/organization';

export function useOrganizations() {
  return useQuery({
    queryKey: ['organizations'],
    queryFn: organizationApi.getAll,
  });
}

export function useCreateOrganization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateOrganizationRequest) => organizationApi.create(payload),
    onSuccess: () => {
      // Refresh the organizations list automatically
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
  });
}