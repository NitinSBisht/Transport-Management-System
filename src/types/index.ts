// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isPasswordChanged?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type UserRole = 'superadmin' | 'admin' | 'dispatcher';

// Authentication Types
export interface LoginCredentials {
  email: string;
  password: string;
  role: number;
  rememberMe: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    token: string;
    user: User;
  };
  error?: string;
  message?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: number, rememberMe: boolean) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  updateUser: (userData: User) => void;
  checkAuth: () => void;
}

// Load Types
export interface Load {
  id: string;
  origin: string;
  destination: string;
  status: LoadStatus;
  dispatcher?: string;
  dispatcherId?: string;
  weight?: string;
  distance?: string;
  pickupTime?: string;
  deliveryTime?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type LoadStatus = 'pending' | 'assigned' | 'in_transit' | 'delivered' | 'cancelled';

// Component Props Types
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  padding?: 'none' | 'sm' | 'default' | 'lg';
  hover?: boolean;
}

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  text?: string;
}

// Route Types
export interface ProtectedRouteProps {
  children: React.ReactNode;
}

export interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export interface PublicRouteProps {
  children: React.ReactNode;
}

// API Types
export interface ApiError {
  message: string;
  status?: number;
  data?: any;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Storage Keys
export interface StorageKeys {
  TOKEN: string;
  USER: string;
  REFRESH_TOKEN: string;
}

// Route Paths
export interface Routes {
  HOME: string;
  LOGIN: string;
  REGISTER: string;
  DASHBOARD: string;
  CHANGE_PASSWORD: string;
  CHAT: string;
  SUPER_ADMIN: {
    DASHBOARD: string;
    MANAGE_ADMINS: string;
    MANAGE_DISPATCHERS: string;
    SETTINGS: string;
    CHAT: string;
  };
  ADMIN: {
    DASHBOARD: string;
    MANAGE_DISPATCHERS: string;
    MANAGE_LOADS: string;
    ASSIGN_LOADS: string;
    SETTINGS: string;
    CHAT: string;
  };
  DISPATCHER: {
    DASHBOARD: string;
    MY_LOADS: string;
    UPDATE_STATUS: string;
    PROFILE: string;
    CHAT: string;
  };
}

// Roles
export interface Roles {
  SUPER_ADMIN: UserRole;
  ADMIN: UserRole;
  DISPATCHER: UserRole;
}

// Notification Types
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

// Statistics Types
export interface DashboardStat {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
}

// Menu Item Types
export interface MenuItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

// Form Types
export interface FormErrors {
  [key: string]: string;
}

// JWT Decoded Token
export interface DecodedToken {
  exp: number;
  iat?: number;
  userId?: string;
  role?: UserRole;
  email?: string;
}

// Chat Types (re-export from socket module)
export type { Message, Conversation, MessageType, MessageStatus } from '../socket/types';
