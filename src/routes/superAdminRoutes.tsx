import React from 'react';
import { Route } from 'react-router-dom';
import RoleBasedRoute from './RoleBasedRoute';
import { ROUTES, ROLES } from '../utils/constants';

// SuperAdmin Pages
import SuperAdminDashboard from '../pages/SuperAdmin/SuperAdminDashboard';
import ManageAdmins from '../pages/SuperAdmin/ManageAdmins';
import ManageDispatchers from '../pages/SuperAdmin/ManageDispatchers';
import ChatPage from '../pages/Chat';

// Placeholder for pages under construction
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="p-8">
    <h1 className="text-3xl font-bold">{title}</h1>
    <p className="mt-4 text-gray-600">This page is under construction.</p>
  </div>
);

/**
 * SuperAdmin protected routes
 */
export const superAdminRoutes = (
  <>
    <Route
      path={ROUTES.SUPER_ADMIN.DASHBOARD}
      element={
        <RoleBasedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
          <SuperAdminDashboard />
        </RoleBasedRoute>
      }
    />
    <Route
      path={ROUTES.SUPER_ADMIN.MANAGE_ADMINS}
      element={
        <RoleBasedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
          <ManageAdmins />
        </RoleBasedRoute>
      }
    />
    <Route
      path={ROUTES.SUPER_ADMIN.MANAGE_DISPATCHERS}
      element={
        <RoleBasedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
          <ManageDispatchers />
        </RoleBasedRoute>
      }
    />
    <Route
      path={ROUTES.SUPER_ADMIN.CHAT}
      element={
        <RoleBasedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
          <ChatPage />
        </RoleBasedRoute>
      }
    />
  </>
);
