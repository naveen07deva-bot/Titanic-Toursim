import { apiClient, TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from './apiClient.js';
import { logJwtAuth, USER_LOGINS_KEY, SAVED_ACCOUNTS_KEY } from '../utils/actionLogger.js';

export { TOKEN_STORAGE_KEY, USER_STORAGE_KEY, USER_LOGINS_KEY, SAVED_ACCOUNTS_KEY };

/**
 * Authentication REST API Service (Experiment 4)
 * Topics: Authentication, Token Management, Protected APIs, LocalStorage Persistence
 */
export const authApi = {
  // Experiment 4a: Implement traveler login using an authentication API
  login: async (email, password, remember = true) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { token, user } = response.data;

      // Experiment 4b: Store the authentication token and user login after successful login
      if (token) {
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));

        // Store user login in localStorage (Requirement 5)
        authApi.saveUserLogin(user, email, password, token);

        if (remember) {
          authApi.saveAccountRecord(user, email);
        }

        // Visible console visibility for JWT authentication & active session
        logJwtAuth('LOGIN_SUCCESS', { token, user });
        console.log('[LOCALSTORAGE & SESSION] Traveler login stored in localStorage["titanic_user_logins"] for:', user.name, `(${user.email})`);
      }

      return { token, user };
    } catch (error) {
      console.error('Login API error:', error.response?.data?.message || error.message);
      throw error;
    }
  },

  // Register brand-new user and store their login information in localStorage
  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      const { token, user } = response.data;

      if (token) {
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        authApi.saveUserLogin(user, userData.email, userData.password, token);
        authApi.saveAccountRecord(user, userData.email);

        logJwtAuth('REGISTER_SUCCESS', { token, user });
        console.log('[LOCALSTORAGE & SESSION] New user registration stored in localStorage["titanic_user_logins"] for:', user.name, `(${user.email})`);
      }

      return { token, user };
    } catch (error) {
      console.error('Register API error:', error.response?.data?.message || error.message);
      throw error;
    }
  },

  // Save full login record to localStorage["titanic_user_logins"]
  saveUserLogin: (user, email, password, token) => {
    try {
      const existingStr = localStorage.getItem(USER_LOGINS_KEY);
      const logins = existingStr ? JSON.parse(existingStr) : [];
      const cleanEmail = email.trim().toLowerCase();

      const newEntry = {
        id: user.id || ('USR-' + Date.now()),
        email: cleanEmail,
        name: user.name || (user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Traveler'),
        title: user.title || 'Lord',
        membershipTier: user.membershipTier || 'First Class Royal Voyager',
        phone: user.phone || '',
        token: token,
        savedAt: new Date().toISOString(),
        formattedTime: new Date().toLocaleString()
      };

      // Keep recent first without duplicates
      const updated = [newEntry, ...logins.filter((l) => l.email.toLowerCase() !== cleanEmail)];
      localStorage.setItem(USER_LOGINS_KEY, JSON.stringify(updated.slice(0, 20)));
      console.log(`[LOCALSTORAGE] Successfully stored login in localStorage["${USER_LOGINS_KEY}"]:`, newEntry);
    } catch (err) {
      console.warn('Could not save login record to localStorage:', err);
    }
  },

  // Retrieve all user logins stored in localStorage
  getUserLogins: () => {
    try {
      const val = localStorage.getItem(USER_LOGINS_KEY);
      return val ? JSON.parse(val) : [];
    } catch {
      return [];
    }
  },

  // Save account record to saved logins list for 1-click use
  saveAccountRecord: (user, email) => {
    try {
      const existingStr = localStorage.getItem(SAVED_ACCOUNTS_KEY);
      const accounts = existingStr ? JSON.parse(existingStr) : [];
      const updated = accounts.filter((a) => a.email.toLowerCase() !== email.toLowerCase());
      updated.unshift({
        id: user.id,
        email: email.toLowerCase(),
        name: user.name,
        membershipTier: user.membershipTier || 'First Class Royal Voyager',
        phone: user.phone || '',
        title: user.title || 'Lord',
        lastLogin: new Date().toISOString()
      });
      localStorage.setItem(SAVED_ACCOUNTS_KEY, JSON.stringify(updated.slice(0, 10)));
    } catch {
      // Ignore localStorage errors
    }
  },

  // Retrieve saved login accounts
  getSavedAccounts: () => {
    try {
      const val = localStorage.getItem(SAVED_ACCOUNTS_KEY);
      return val ? JSON.parse(val) : [];
    } catch {
      return [];
    }
  },

  // Fetch list of registered users from mock server
  getRegisteredUsers: async () => {
    try {
      const response = await apiClient.get('/auth/users');
      return response.data?.users || [];
    } catch {
      return [];
    }
  },

  // Experiment 4e: Implement logout and token removal
  logout: () => {
    const priorUser = authApi.getCurrentUser();
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    logJwtAuth('LOGOUT', { user: priorUser });
    console.log('[SESSION CLEARED] Active traveler session ended. Token cleared from localStorage. Current session: Guest.');
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

