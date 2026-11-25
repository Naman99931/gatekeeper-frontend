import { apiClient } from './client';
import type {
  CreateOrganizationRequest,
  CreateTenantAdminRequest,
  Organization,
  OrganizationStatus,
  TenantAdmin,
  UpdateOrganizationRequest,
} from '@/types/organization';

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

  updateStatus: async (id: number, status: OrganizationStatus): Promise<Organization> => {
    const { data } = await apiClient.patch<Organization>(`/platform/organizations/${id}/status`, {
      status,
    });
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/platform/organizations/${id}`);
  },

  getTenantAdmin: async (organizationId: number): Promise<TenantAdmin> => {
    const { data } = await apiClient.get<TenantAdmin>(`/platform/organizations/${organizationId}/tenant`);
    return data;
  },

  createTenantAdmin: async (
    organizationId: number,
    payload: CreateTenantAdminRequest
  ): Promise<TenantAdmin> => {
    const { data } = await apiClient.post<TenantAdmin>(
      `/platform/organizations/createTenant?organizationId=${organizationId}`,
      payload
    );
    return data;
  },

  updateTenantAdmin: async (
    organizationId: number,
    payload: import('@/types/organization').UpdateTenantAdminRequest
  ): Promise<TenantAdmin> => {
    const { data } = await apiClient.put<TenantAdmin>(
      `/platform/organizations/updateTenant/${organizationId}`,
      payload
    );
    return data;
  },
};
