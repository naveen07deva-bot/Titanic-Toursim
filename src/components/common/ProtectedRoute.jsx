import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loading } from './Loading';

/**
 * ProtectedRoute Component (Experiment 4 Deliverable)
 * Restricts access to /booking, /checkout, /bookings
 * Redirects unauthenticated users to /login preserving the requested location
 */
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading fullScreen message="Verifying passenger manifest & credentials..." />;
  }

  if (!isAuthenticated) {
    // Redirect to login, preserving intended path in state.from
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
