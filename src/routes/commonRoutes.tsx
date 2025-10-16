import React from 'react';
import { Route } from 'react-router-dom';

// Common Pages (accessible to all authenticated users)
import ChangePassword from '../pages/Auth/ChangePassword';
import Profile from '../pages/Profile/Profile';

/**
 * Common routes accessible to all authenticated users
 */
export const commonRoutes = (
  <>
    <Route path="/change-password" element={<ChangePassword />} />
    <Route path="/profile" element={<Profile />} />
  </>
);
