import { apiClient } from './client';
import type { RoleOption } from '@/types/management_user';

export const rolesApi = {
  list: async (): Promise<RoleOption[]> => {
    const { data } = await apiClient.get<RoleOption[]>('/roles');
    return data;
  },
};
