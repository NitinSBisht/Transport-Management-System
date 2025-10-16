import api from './api';
import { setToken, setUser, clearAuthData } from '../utils/helpers';
import { 
  LoginCredentials, 
  RegisterData, 
  AuthResponse, 
  User, 
  ApiResponse 
} from '../types';

/**
 * Login user
 */
export const login = async (email: string, password: string, role: number, rememberMe: boolean): Promise<AuthResponse> => {
  try {
    const response = await api.post('/auth/login', {
      payload: {
        email,
        password,
        role,
        rememberMe
      }
    });
    
    // Handle new API response structure
    const { accessToken, refreshToken, role: userRole, isPasswordChanged } = response.data.data;
    
    // Create user object from response
    const user: User = {
      id: email, // Using email as ID since userId is null
      email: email,
      name: email.split('@')[0], // Extract name from email
      role: getRoleFromNumber(userRole),
      isPasswordChanged: isPasswordChanged,
    };
    
    // Store tokens and user data
    setToken(accessToken);
    if (refreshToken) {
      localStorage.setItem('tms_refresh_token', refreshToken);
    }
    setUser(user);
    
    return { 
      success: true, 
      data: { token: accessToken, user },
      message: response.data.message // Pass backend success message
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message // Pass backend error message
    };
  }
};

// Helper function to convert role number to role string
const getRoleFromNumber = (roleNumber: number): 'superadmin' | 'admin' | 'dispatcher' => {
  switch (roleNumber) {
    case 1:
      return 'superadmin';
    case 2:
      return 'admin';
    case 3:
      return 'dispatcher';
    case 4:
      return 'dispatcher'; // Driver maps to dispatcher for now
    case 5:
      return 'dispatcher'; // User maps to dispatcher for now
    default:
      return 'dispatcher';
  }
};

/**
 * Register new user
 */
export const register = async (userData: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await api.post<ApiResponse<{ token: string; user: User }>>('/auth/register', userData);
    const { token, user } = response.data.data!;
    
    // Store token and user data
    setToken(token);
    setUser(user);
    
    return { 
      success: true, 
      data: { token, user },
      message: response.data.message
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message
    };
  }
};

/**
 * Refresh access token
 */
export const refreshToken = async (): Promise<AuthResponse> => {
  try {
    const refreshToken = localStorage.getItem('tms_refresh_token');
    const response = await api.post('/auth/refresh-token', {
      refreshToken
    });
    
    const { accessToken } = response.data.data;
    setToken(accessToken);
    
    return {
      success: true,
      data: { token: accessToken, user: null as any },
      message: response.data.message
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message
    };
  }
};

/**
 * Logout user
 */
export const logout = async (): Promise<void> => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    clearAuthData();
    localStorage.removeItem('tms_refresh_token');
  }
};

/**
 * Forgot password
 */
export const forgotPassword = async (email: string, role: number): Promise<AuthResponse> => {
  try {
    const response = await api.post('/auth/forgot-password', {
      payload: {
        email,
        role
      }
    });
    
    return {
      success: true,
      message: response.data.message
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message
    };
  }
};

/**
 * Change password
 */
export const changePassword = async (oldPassword: string, password: string, confirmPassword: string): Promise<AuthResponse> => {
  try {
    const response = await api.post('/auth/password', {
      payload: {
        oldPassword,
        password,
        confirmPassword
      }
    });
    
    return {
      success: true,
      message: response.data.message
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message
    };
  }
};

/**
 * Reset password
 */
export const resetPassword = async (password: string, confirmPassword: string, token?: string): Promise<AuthResponse> => {
  try {
    const response = await api.post('/auth/reset-password', {
      payload: {
        password,
        confirmPassword
      }
    }, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    
    return {
      success: true,
      message: response.data.message
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message
    };
  }
};

/**
 * Get current user profile
 */
export const getCurrentUser = async (): Promise<ApiResponse<User>> => {
  try {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return { 
      success: true, 
      data: response.data.data,
      message: response.data.message
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message
    };
  }
};


