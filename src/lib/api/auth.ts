import { apiClient } from './client';
import type { LoginRequest, LoginResponse, AuthUser } from '@/types/auth';

export const authApi = {
  login: async (payload: LoginRequest): Promise<LoginResponse> => {
    const { data } = await apiClient.post<LoginResponse>('/auth/login', payload);
    return data;
  },

  // Optional: call this on app load instead of trusting a cached user object,
  // if your backend exposes a "who am I" endpoint.
  me: async (): Promise<AuthUser> => {
    const { data } = await apiClient.get<AuthUser>('/auth/me');
    return data;
  },
};
