import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'
import { ROUTES, ROLES } from '../utils/constants'

// Route Guards
import ProtectedRoute from './ProtectedRoute'

// Layout
import { MainLayout } from '../components/Layout'

// Modular Route Imports
import { authRoutes } from './authRoutes'
import { superAdminRoutes } from './superAdminRoutes'
import { adminRoutes } from './adminRoutes'
import { dispatcherRoutes } from './dispatcherRoutes'
import { commonRoutes } from './commonRoutes'

const AppRoutes: React.FC = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)

  const getRootRedirect = () => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />
    }

    const userRole = user?.role
    if (userRole === ROLES.SUPER_ADMIN) {
      return <Navigate to={ROUTES.SUPER_ADMIN.DASHBOARD} replace />
    } else if (userRole === ROLES.ADMIN) {
      return <Navigate to={ROUTES.ADMIN.DASHBOARD} replace />
    } else if (userRole === ROLES.DISPATCHER) {
      return <Navigate to={ROUTES.DISPATCHER.DASHBOARD} replace />
    }

    return <Navigate to="/login" replace />
  }

  return (
    <Routes>
      {/* Root Route */}
      <Route path="/" element={getRootRedirect()} />

      {/* Public Auth Routes */}
      {authRoutes}

      {/* Protected Routes with Layout */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        {/* Common Routes - Available to all authenticated users */}
        {commonRoutes}

        {/* SuperAdmin Routes */}
        {superAdminRoutes}

        {/* Admin Routes */}
        {adminRoutes}

        {/* Dispatcher Routes */}
        {dispatcherRoutes}
      </Route>

      {/* Catch all - redirect to root */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
