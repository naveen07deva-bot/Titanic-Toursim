import { apiClient, TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from './apiClient.js';
import { logJwtAuth } from '../utils/actionLogger.js';

/**
 * Authentication REST API Service (Experiment 4)
 * Topics: Authentication, Token Management, Protected APIs
 */
export const authApi = {
  // Experiment 4a: Implement traveler login using an authentication API
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { token, user } = response.data;

      // Experiment 4b: Store the authentication token after successful login
      if (token) {
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        // Console visibility for JWT authentication (Experiment 4)
        logJwtAuth('LOGIN_SUCCESS', { token, user });
      }

      return { token, user };
    } catch (error) {
      console.error('Login API error:', error.response?.data?.message || error.message);
      throw error;
    }
  },

  // Experiment 4e: Implement logout and token removal
  logout: () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    logJwtAuth('LOGOUT');
  },

  // Token retrieval
  getToken: () => {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  },

  // Current user retrieval
  getCurrentUser: () => {
    try {
      const u = localStorage.getItem(USER_STORAGE_KEY);
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  },

  // Check if authenticated with valid token
  isAuthenticated: () => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    return !!token && token.length > 10;
  },

  // Experiment 4f: Simulate expired token for testing expiration handling
  setSimulatedExpiredToken: () => {
    const expiredToken = 'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjEwMDAwMDAwMDB9.titanic_expired_sig';
    localStorage.setItem(TOKEN_STORAGE_KEY, expiredToken);
    logJwtAuth('SIMULATED_EXPIRED_TOKEN_INJECTED', { token: expiredToken });
    return expiredToken;
  },

  // Experiment 4f: Simulate invalid corrupted token
  setSimulatedInvalidToken: () => {
    const invalidToken = 'invalid_corrupted_token_xyz';
    localStorage.setItem(TOKEN_STORAGE_KEY, invalidToken);
    logJwtAuth('SIMULATED_INVALID_TOKEN_INJECTED', { token: invalidToken });
    return invalidToken;
  }
};
