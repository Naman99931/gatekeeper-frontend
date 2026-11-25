import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { routeApi } from '@/lib/api/routes';
import type { RouteRequest } from '@/types/route';

export function useRoutes() {
  return useQuery({
    queryKey: ['routes'],
    queryFn: routeApi.getAll,
  });
}

export function useRoute(id: number) {
  return useQuery({
    queryKey: ['routes', id],
    queryFn: () => routeApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateRoute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RouteRequest) => routeApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
    },
  });
}

export function useUpdateRoute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: RouteRequest }) =>
      routeApi.update(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      queryClient.invalidateQueries({ queryKey: ['routes', id] });
    },
  });
}

export function useChangeRouteStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, active }: { id: number; active: boolean }) =>
      routeApi.changeStatus(id, active),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      queryClient.invalidateQueries({ queryKey: ['routes', id] });
    },
  });
}

export function useDeleteRoute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => routeApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
    },
  });
}
