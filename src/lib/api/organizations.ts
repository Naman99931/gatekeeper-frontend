import { apiClient } from './client';
import type { CreateOrganizationRequest, Organization, UpdateOrganizationRequest } from '@/types/organization';

export const organizationApi = {
  getAll: async (): Promise<Organization[]> => {
    const { data } = await apiClient.get<Organization[]>('/platform/organizations');
    return data;
  },

  create: async (payload: CreateOrganizationRequest): Promise<Organization> => {
    const { data } = await apiClient.post<Organization>('/platform/organizations', payload);
    return data;
  },

  getById: async (id: number): Promise<Organization> => {
    const { data } = await apiClient.get<Organization>(`/platform/organizations/${id}`);
    return data;
  },

  update: async (id: number, payload: UpdateOrganizationRequest): Promise<Organization> => {
    const { data } = await apiClient.put<Organization>(`/platform/organizations/${id}`, payload);
    return data;
  },
};
