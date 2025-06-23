import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { isAuthenticated, user } = useAuth();

  // Fallback to sessionStorage if AuthContext is not set yet
  const storedUser = JSON.parse(sessionStorage.getItem('user') || '{}');
  const effectiveUser = user || storedUser;
  const token = sessionStorage.getItem('token');

  if (!isAuthenticated && !token) {
    return <Navigate to="/Dash/login-master" replace />;
  }

  if (requiredRole && effectiveUser?.role !== requiredRole) {
    return <Navigate to="/Dash" replace />;
  }

  return <>{children}</>;
};
