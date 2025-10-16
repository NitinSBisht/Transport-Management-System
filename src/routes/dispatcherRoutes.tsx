import React from 'react';
import { Route } from 'react-router-dom';
import RoleBasedRoute from './RoleBasedRoute';
import { ROUTES, ROLES } from '../utils/constants';

// Dispatcher Pages
import DispatcherDashboard from '../pages/Dispatcher/DispatcherDashboard';
import ChatPage from '../pages/Chat';

// Placeholder for pages under construction
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="p-8">
    <h1 className="text-3xl font-bold">{title}</h1>
    <p className="mt-4 text-gray-600">This page is under construction.</p>
  </div>
);

/**
 * Dispatcher protected routes
 */
export const dispatcherRoutes = (
  <>
    <Route
      path={ROUTES.DISPATCHER.DASHBOARD}
      element={
        <RoleBasedRoute allowedRoles={[ROLES.DISPATCHER]}>
          <DispatcherDashboard />
        </RoleBasedRoute>
      }
    />
    <Route
      path={ROUTES.DISPATCHER.MY_LOADS}
      element={
        <RoleBasedRoute allowedRoles={[ROLES.DISPATCHER]}>
          <PlaceholderPage title="My Loads" />
        </RoleBasedRoute>
      }
    />
    <Route
      path={ROUTES.DISPATCHER.UPDATE_STATUS}
      element={
        <RoleBasedRoute allowedRoles={[ROLES.DISPATCHER]}>
          <PlaceholderPage title="Update Status" />
        </RoleBasedRoute>
      }
    />
    <Route
      path={ROUTES.DISPATCHER.PROFILE}
      element={
        <RoleBasedRoute allowedRoles={[ROLES.DISPATCHER]}>
          <PlaceholderPage title="Profile" />
        </RoleBasedRoute>
      }
    />
    <Route
      path={ROUTES.DISPATCHER.CHAT}
      element={
        <RoleBasedRoute allowedRoles={[ROLES.DISPATCHER]}>
          <ChatPage />
        </RoleBasedRoute>
      }
    />
  </>
);
