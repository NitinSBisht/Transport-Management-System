import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { ROUTES, ROLES } from '../utils/constants';
import { PublicRouteProps } from '../types';
import { Loader } from '../components/Common';
import { getToken, getUser } from '../utils/helpers';

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication directly from localStorage
    const token = getToken();
    const user = getUser();
    
    if (token && user) {
      setIsAuth(true);
      setUserRole(user.role);
    }
    setChecking(false);
  }, []);

  // Show loader while checking authentication
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader size="lg" text="Loading..." />
      </div>
    );
  }

  // If authenticated, redirect to appropriate dashboard
  if (isAuth && userRole) {
    if (userRole === ROLES.SUPER_ADMIN) {
      return <Navigate to={ROUTES.SUPER_ADMIN.DASHBOARD} replace />;
    } else if (userRole === ROLES.ADMIN) {
      return <Navigate to={ROUTES.ADMIN.DASHBOARD} replace />;
    } else if (userRole === ROLES.DISPATCHER) {
      return <Navigate to={ROUTES.DISPATCHER.DASHBOARD} replace />;
    }
  }

  return <>{children}</>;
};

export default PublicRoute;
