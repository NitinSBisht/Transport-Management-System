import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useRole } from '../hooks/useRole';
import { Loader } from '../components/Common';
import { ROUTES } from '../utils/constants';
import { RoleBasedRouteProps } from '../types';

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const { hasAnyRole } = useRole();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Loading..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!hasAnyRole(allowedRoles)) {
    const userRole = user?.role;
    
    if (userRole === 'superadmin') {
      return <Navigate to={ROUTES.SUPER_ADMIN.DASHBOARD} replace />;
    } else if (userRole === 'admin') {
      return <Navigate to={ROUTES.ADMIN.DASHBOARD} replace />;
    } else if (userRole === 'dispatcher') {
      return <Navigate to={ROUTES.DISPATCHER.DASHBOARD} replace />;
    }
    
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default RoleBasedRoute;
