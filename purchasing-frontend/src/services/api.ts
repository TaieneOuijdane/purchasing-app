import axios from 'axios';
import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { authService } from './authService';

// Interface for API error
interface ApiError extends Error {
  statusCode?: number;
  validationErrors?: Record<string, string>;
  message: string;
}

// Create axios instance with base configuration
const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/ld+json',
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  (error: AxiosError): Promise<ApiError> => {
    const { response } = error;
    
    // Handle authentication errors
    if (response && response.status === 401) {
      authService.clearAuthData();
    }
    
    const apiError = {
      message: (response?.data as any)?.message || 'Something went wrong. Please try again.',
      statusCode: response ? response.status : undefined,
      ...(response?.data || {})
    };
    
    return Promise.reject(apiError);
  }
);

export default api;