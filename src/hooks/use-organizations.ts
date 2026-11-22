import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { organizationApi } from '@/lib/api/organizations';
import { CreateOrganizationRequest, UpdateOrganizationRequest } from '@/types/organization';

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

export function useUpdateOrganization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateOrganizationRequest }) =>
      organizationApi.update(id, payload),
    onSuccess: (_, { id }) => {
      // Invalidate both the list and the individual organization query
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      queryClient.invalidateQueries({ queryKey: ['organizations', id] });
    },
  });
}

export function useOrganization(id: number) {
  return useQuery({
    queryKey: ['organizations', id],
    queryFn: () => organizationApi.getById(id),
    enabled: !!id,
  });
}