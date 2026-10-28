import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authApi.getCurrentUser());
  const [token, setToken] = useState(() => authApi.getToken());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [sessionStartTime, setSessionStartTime] = useState(() => {
    return authApi.getToken() ? new Date().toLocaleTimeString() : null;
  });
  const [savedAccounts, setSavedAccounts] = useState(() => authApi.getSavedAccounts());

  const refreshSavedAccounts = () => {
    setSavedAccounts(authApi.getSavedAccounts());
  };

  // Experiment 4a & 4b: Traveler login using authentication API and token storage
  const login = async (email, password, remember = true) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authApi.login(email, password, remember);
      setUser(result.user);
      setToken(result.token);
      setSessionStartTime(new Date().toLocaleTimeString());
      refreshSavedAccounts();
      setLoading(false);
      return { success: true, user: result.user, token: result.token };
    } catch (err) {
      setLoading(false);
      const msg = err.response?.data?.message || err.message || 'Authentication failed';
      setError(msg);
      throw new Error(msg);
    }
  };

  // Register brand-new user and store their login information
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authApi.register(userData);
      setUser(result.user);
      setToken(result.token);
      setSessionStartTime(new Date().toLocaleTimeString());
      refreshSavedAccounts();
      setLoading(false);
      return { success: true, user: result.user, token: result.token };
    } catch (err) {
      setLoading(false);
      const msg = err.response?.data?.message || err.message || 'Registration failed';
      setError(msg);
      throw new Error(msg);
    }
  };

  // Experiment 4f: Handle invalid and expired tokens in real time
  useEffect(() => {
    const handleAuthExpired = (event) => {
      setUser(null);
      setToken(null);
      setSessionStartTime(null);
      setError(event.detail?.message || 'Session expired. Please log in again.');
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('titanic_token_expired', handleAuthExpired);
      return () => {
        window.removeEventListener('titanic_token_expired', handleAuthExpired);
      };
    }
  }, []);

  // Experiment 4e: Implement logout and token removal
  const logout = () => {
    authApi.logout();
    setUser(null);
    setToken(null);
    setSessionStartTime(null);
    setError(null);
    refreshSavedAccounts();
  };

  const sessionInfo = {
    isAuthenticated: !!token && !!user,
    sessionStatus: token && user ? 'Active (Authenticated)' : 'Guest (Unauthenticated)',
    sessionStartTime: sessionStartTime || (token ? 'Earlier Today' : 'Not started'),
    token: token,
    user: user,
    membershipTier: user?.membershipTier || 'First Class Royal Voyager',
    savedAccountsCount: savedAccounts.length
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    loading,
    error,
    login,
    register,
    logout,
    sessionInfo,
    savedAccounts,
    refreshSavedAccounts
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
