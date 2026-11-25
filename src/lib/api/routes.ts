import { apiClient } from './client';
import type { RouteRequest, RouteResponse } from '@/types/route';

export const routeApi = {
  getAll: async (): Promise<RouteResponse[]> => {
    const { data } = await apiClient.get<RouteResponse[]>('/tenant/routes');
    return data;
  },

  getById: async (id: number): Promise<RouteResponse> => {
    const { data } = await apiClient.get<RouteResponse>(`/tenant/routes/${id}`);
    return data;
  },

  create: async (payload: RouteRequest): Promise<RouteResponse> => {
    const { data } = await apiClient.post<RouteResponse>('/tenant/routes', payload);
    return data;
  },

  update: async (id: number, payload: RouteRequest): Promise<RouteResponse> => {
    const { data } = await apiClient.put<RouteResponse>(`/tenant/routes/${id}`, payload);
    return data;
  },

  changeStatus: async (id: number, active: boolean): Promise<RouteResponse> => {
    const { data } = await apiClient.patch<RouteResponse>(`/tenant/routes/${id}/status`, {
      active,
    });
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/tenant/routes/${id}`);
  },
};
