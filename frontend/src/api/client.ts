import axios, { type AxiosInstance, type AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

// Log the API URL for debugging (only in development)
if (import.meta.env.DEV) {
  console.log('API URL:', API_URL);
}

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Only handle 401 errors for authenticated endpoints (not public OCM/OCPP)
    if (error.response?.status === 401) {
      const url = error.config?.url || '';
      // Only redirect to login for user-specific endpoints
      if (url.includes('/user/') || url.includes('/sessions') || url.includes('/favorites')) {
        localStorage.removeItem('authToken');
        // Only redirect if we're not already on the login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }

    // For network errors, provide a more helpful message
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error - API may be unavailable:', API_URL);
    }

    return Promise.reject(error);
  }
);
