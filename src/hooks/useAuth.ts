import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginUser, logoutUser, checkAuth as checkAuthAction, updateUserData } from '../store/slices/authSlice';
import { User, AuthResponse } from '../types';

/**
 * Custom hook to access authentication state from Redux
 */
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, loading, error } = useAppSelector((state) => state.auth);

  // Removed automatic checkAuth on mount to prevent unnecessary checks
  // Auth will be checked once in the store initialization

  const login = async (email: string, password: string, role: number, rememberMe: boolean): Promise<AuthResponse> => {
    try {
      const result = await dispatch(loginUser({ email, password, role, rememberMe })).unwrap();
      return { success: true, data: result, message: result.message };
    } catch (error: any) {
      return { success: false, error: error };
    }
  };

  const logout = async (): Promise<void> => {
    await dispatch(logoutUser());
  };

  const updateUser = (userData: User): void => {
    dispatch(updateUserData(userData));
  };

  const checkAuth = (): void => {
    dispatch(checkAuthAction());
  };

  return {
    user,
    loading,
    isAuthenticated,
    error,
    login,
    logout,
    updateUser,
    checkAuth,
  };
};
