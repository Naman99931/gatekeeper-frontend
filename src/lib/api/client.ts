import axios, { AxiosError } from 'axios';

/**
 * Single axios instance for the whole app.
 * Point NEXT_PUBLIC_API_URL at your Spring Boot base path, e.g.
 * http://localhost:8080/api
 */
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Attach the JWT (or whatever your Spring Security setup issues) on every request.
// Swap the storage lookup for however you persist the token once auth is added.
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = window.localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Normalize Spring Boot error bodies (typically { message, status, errors: [...] }
// if you're using a standard @ControllerAdvice error handler) into one shape.
export interface ApiError {
  status: number;
  message: string;
  fieldErrors?: Record<string, string>;
}

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    const status = error.response?.status ?? 0;
    const body = error.response?.data;

    const normalized: ApiError = {
      status,
      message: body?.message || error.message || 'Something went wrong',
      fieldErrors: body?.errors,
    };

    if (typeof window !== 'undefined' && status === 401) {
      window.localStorage.removeItem('auth_token');
      window.localStorage.removeItem('auth_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(normalized);
  }
);
