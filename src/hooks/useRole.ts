import { useAuth } from './useAuth';
import { ROLES } from '../utils/constants';
import { UserRole } from '../types';

interface UseRoleReturn {
  role: UserRole | undefined;
  isSuperAdmin: () => boolean;
  isAdmin: () => boolean;
  isDispatcher: () => boolean;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  canManageAdmins: () => boolean;
  canManageDispatchers: () => boolean;
  canManageLoads: () => boolean;
  canViewLoads: () => boolean;
  canUpdateLoadStatus: () => boolean;
}

/**
 * Custom hook to check user roles and permissions
 */
export const useRole = (): UseRoleReturn => {
  const { user } = useAuth();

  const isSuperAdmin = (): boolean => {
    return user?.role === ROLES.SUPER_ADMIN;
  };

  const isAdmin = (): boolean => {
    return user?.role === ROLES.ADMIN;
  };

  const isDispatcher = (): boolean => {
    return user?.role === ROLES.DISPATCHER;
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return user ? roles.includes(user.role) : false;
  };

  const canManageAdmins = (): boolean => {
    return isSuperAdmin();
  };

  const canManageDispatchers = (): boolean => {
    return isSuperAdmin() || isAdmin();
  };

  const canManageLoads = (): boolean => {
    return isSuperAdmin() || isAdmin();
  };

  const canViewLoads = (): boolean => {
    return true; // All authenticated users can view loads
  };

  const canUpdateLoadStatus = (): boolean => {
    return isDispatcher() || isAdmin() || isSuperAdmin();
  };

  return {
    role: user?.role,
    isSuperAdmin,
    isAdmin,
    isDispatcher,
    hasRole,
    hasAnyRole,
    canManageAdmins,
    canManageDispatchers,
    canManageLoads,
    canViewLoads,
    canUpdateLoadStatus
  };
};
