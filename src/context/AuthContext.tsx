import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getToken, getUser, isTokenExpired, clearAuthData } from '../utils/helpers';
import { login as loginService, logout as logoutService } from '../services/authService';
import { AuthContextType, User, AuthResponse } from '../types';

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = (): void => {
    const token = getToken();
    const userData = getUser();

    if (token && userData && !isTokenExpired(token)) {
      setUser(userData);
      setIsAuthenticated(true);
    } else {
      clearAuthData();
      setUser(null);
      setIsAuthenticated(false);
    }
    setLoading(false);
  };

  const login = async (email: string, password: string, role: number, rememberMe: boolean): Promise<AuthResponse> => {
    try {
      const result = await loginService(email, password, role, rememberMe);
      
      if (result.success && result.data) {
        setUser(result.data.user);
        setIsAuthenticated(true);
        return { success: true, message: result.message };
      }
      
      return { success: false, error: result.error };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.message || error.message };
    }
  };

  const logout = async (): Promise<void> => {
    await logoutService();
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (userData: User): void => {
    setUser(userData);
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUser,
    checkAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
