import { useQuery } from '@tanstack/react-query';
import { organizationApi } from '@/lib/api/organizations';

export function useOrganizations() {
  return useQuery({
    queryKey: ['organizations'],
    queryFn: organizationApi.getAll,
  });
}
