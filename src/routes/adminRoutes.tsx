import React from 'react';
import { Route } from 'react-router-dom';
import RoleBasedRoute from './RoleBasedRoute';
import { ROUTES, ROLES } from '../utils/constants';

// Admin Pages
import AdminDashboard from '../pages/Admin/AdminDashboard';
import ManageDispatchers from '../pages/Admin/ManageDispatchers';
import ChatPage from '../pages/Chat';

// Placeholder for pages under construction
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="p-8">
    <h1 className="text-3xl font-bold">{title}</h1>
    <p className="mt-4 text-gray-600">This page is under construction.</p>
  </div>
);

/**
 * Admin protected routes
 */
export const adminRoutes = (
  <>
    <Route
      path={ROUTES.ADMIN.DASHBOARD}
      element={
        <RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
          <AdminDashboard />
        </RoleBasedRoute>
      }
    />
    <Route
      path={ROUTES.ADMIN.MANAGE_DISPATCHERS}
      element={
        <RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
          <ManageDispatchers />
        </RoleBasedRoute>
      }
    />
    <Route
      path={ROUTES.ADMIN.MANAGE_LOADS}
      element={
        <RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
          <PlaceholderPage title="Manage Loads" />
        </RoleBasedRoute>
      }
    />
    <Route
      path={ROUTES.ADMIN.ASSIGN_LOADS}
      element={
        <RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
          <PlaceholderPage title="Assign Loads" />
        </RoleBasedRoute>
      }
    />
    <Route
      path={ROUTES.ADMIN.CHAT}
      element={
        <RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
          <ChatPage />
        </RoleBasedRoute>
      }
    />
  </>
);
