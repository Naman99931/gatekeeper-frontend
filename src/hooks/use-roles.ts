'use client';
import { useQuery } from '@tanstack/react-query';
import { rolesApi } from '@/lib/api/roles';

export function useRoles() {
  return useQuery({
    queryKey: ['roles'],
    queryFn: rolesApi.list,
    staleTime: 5 * 60_000, // roles rarely change within a session — cache longer
  });
}
