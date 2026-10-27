import axios from 'axios';
import { mockRestApiAdapter } from './mockBackend.js';
import { logApiRequest, logApiResponse, logJwtAuth } from '../utils/actionLogger.js';

// Storage keys
export const TOKEN_STORAGE_KEY = 'titanic_auth_token';
export const USER_STORAGE_KEY = 'titanic_auth_user';

// Create configured Axios instance (Experiment 1, 3, 4)
export const apiClient = axios.create({
  baseURL: 'https://api.titanictourism.com/api/v1',
  timeout: 8000,
  adapter: mockRestApiAdapter,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request Interceptor: Attach Token to Protected Requests (Experiment 4c)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // Console logging of API request with JWT status
    logApiRequest(config);

    // Dispatch custom event for UI real-time API monitor
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('titanic_api_request', {
          detail: {
            method: config.method?.toUpperCase(),
            url: config.url,
            hasToken: !!token,
            timestamp: new Date().toLocaleTimeString()
          }
        })
      );
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Error handling & token expiration (Experiment 4d, 4e, 4f)
apiClient.interceptors.response.use(
  (response) => {
    // Console logging of API response
    logApiResponse(response);

    // Dispatch custom event for UI monitor
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('titanic_api_response', {
          detail: {
            status: response.status,
            url: response.config.url,
            timestamp: new Date().toLocaleTimeString()
          }
        })
      );
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized request. Token invalid or expired.');

      // Console logging of JWT expiration
      logJwtAuth('TOKEN_EXPIRED_OR_INVALID', {
        context: error.response?.data?.message || 'Authentication session has expired or is invalid (401).'
      });

      // Remove invalid token from storage (Experiment 4f)
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);

      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('titanic_token_expired', {
            detail: {
              message: error.response?.data?.message || 'Authentication session has expired or is invalid.'
            }
          })
        );
      }
    }
    return Promise.reject(error);
  }
);
