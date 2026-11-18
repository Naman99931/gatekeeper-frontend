import { apiClient } from './client';
import type { Organization } from '@/types/organization';

export const organizationApi = {
  getAll: async (): Promise<Organization[]> => {
    const { data } = await apiClient.get<Organization[]>('/platform/organizations');
    return data;
  },
};
