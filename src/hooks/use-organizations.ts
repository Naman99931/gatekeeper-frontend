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

export function useDeleteOrganization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => organizationApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
  });
}

export function useUpdateOrganizationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: import('@/types/organization').OrganizationStatus }) =>
      organizationApi.updateStatus(id, status),
    onSuccess: (_, { id }) => {
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

export function useTenantAdmin(organizationId: number) {
  return useQuery({
    queryKey: ['organizations', organizationId, 'tenant'],
    queryFn: () => organizationApi.getTenantAdmin(organizationId),
    enabled: !!organizationId,
    retry: false,
  });
}

export function useCreateTenantAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      organizationId,
      payload,
    }: {
      organizationId: number;
      payload: import('@/types/organization').CreateTenantAdminRequest;
    }) => organizationApi.createTenantAdmin(organizationId, payload),
    onSuccess: (_, { organizationId }) => {
      queryClient.invalidateQueries({ queryKey: ['organizations', organizationId, 'tenant'] });
    },
  });
}

export function useUpdateTenantAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      organizationId,
      payload,
    }: {
      organizationId: number;
      payload: import('@/types/organization').UpdateTenantAdminRequest;
    }) => organizationApi.updateTenantAdmin(organizationId, payload),
    onSuccess: (_, { organizationId }) => {
      queryClient.invalidateQueries({ queryKey: ['organizations', organizationId, 'tenant'] });
    },
  });
}
