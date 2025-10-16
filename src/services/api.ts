import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../utils/constants';
import { getToken, clearAuthData, setToken } from '../utils/helpers';
import { navigateTo } from '../utils/navigation';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Request interceptor - Add token to requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors and token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError<any>) => {
    const originalRequest: any = error.config;

    if (error.response) {
      // Handle 401 Unauthorized - Try to refresh token
      if (error.response.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // If already refreshing, queue this request
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(token => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          }).catch(err => {
            return Promise.reject(err);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = localStorage.getItem('tms_refresh_token');
        
        if (!refreshToken) {
          // No refresh token, logout
          clearAuthData();
          localStorage.removeItem('tms_refresh_token');
          navigateTo('/login', true);
          return Promise.reject(error);
        }

        try {
          // Try to refresh the token
          const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
            refreshToken
          });

          const { accessToken } = response.data.data;
          setToken(accessToken);
          
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }

          processQueue(null, accessToken);
          isRefreshing = false;

          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed, logout
          processQueue(refreshError, null);
          isRefreshing = false;
          
          const errorMsg = error.response.data?.message;
          if (errorMsg) {
            toast.error(errorMsg);
          }
          
          clearAuthData();
          localStorage.removeItem('tms_refresh_token');
          navigateTo('/login', true);
          return Promise.reject(refreshError);
        }
      }
      
      // Handle 403 Forbidden - Insufficient permissions
      if (error.response.status === 403) {
        const errorMsg = error.response.data?.message;
        if (errorMsg) {
          toast.error(errorMsg);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
