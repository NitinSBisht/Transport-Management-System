import { Roles, Routes, StorageKeys, LoadStatus as LoadStatusType } from '../types';

// User Roles
export const ROLES: Roles = {
  SUPER_ADMIN: 'superadmin',
  ADMIN: 'admin',
  DISPATCHER: 'dispatcher'
};

// API Base URL - Update this with your actual API URL
export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Local Storage Keys
export const STORAGE_KEYS: StorageKeys = {
  TOKEN: 'tms_token',
  USER: 'tms_user',
  REFRESH_TOKEN: 'tms_refresh_token'
};

// Route Paths
export const ROUTES: Routes = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  CHANGE_PASSWORD: '/change-password',
  CHAT: '/chat',
  
  // SuperAdmin Routes
  SUPER_ADMIN: {
    DASHBOARD: '/superadmin/dashboard',
    MANAGE_ADMINS: '/superadmin/admins',
    MANAGE_DISPATCHERS: '/superadmin/dispatchers',
    SETTINGS: '/superadmin/settings',
    CHAT: '/chat'
  },
  
  // Admin Routes
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    MANAGE_DISPATCHERS: '/admin/dispatchers',
    MANAGE_LOADS: '/admin/loads',
    ASSIGN_LOADS: '/admin/assign-loads',
    SETTINGS: '/admin/settings',
    CHAT: '/chat'
  },
  
  // Dispatcher Routes
  DISPATCHER: {
    DASHBOARD: '/dispatcher/dashboard',
    MY_LOADS: '/dispatcher/loads',
    UPDATE_STATUS: '/dispatcher/update-status',
    PROFILE: '/dispatcher/profile',
    CHAT: '/chat'
  }
};

// Load Status
export const LOAD_STATUS: Record<string, LoadStatusType> = {
  PENDING: 'pending',
  ASSIGNED: 'assigned',
  IN_TRANSIT: 'in_transit',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
} as const;
