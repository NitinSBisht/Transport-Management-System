import { STORAGE_KEYS } from './constants';
import { User } from '../types';

/**
 * Store token in localStorage
 */
export const setToken = (token: string): void => {
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
};

/**
 * Get token from localStorage
 */
export const getToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
};

/**
 * Remove token from localStorage
 */
export const removeToken = (): void => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
};

/**
 * Store user data in localStorage
 */
export const setUser = (user: User): void => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

/**
 * Get user data from localStorage
 */
export const getUser = (): User | null => {
  try {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

/**
 * Remove user data from localStorage
 */
export const removeUser = (): void => {
  localStorage.removeItem(STORAGE_KEYS.USER);
};

/**
 * Clear all auth data from localStorage
 */
export const clearAuthData = (): void => {
  removeToken();
  removeUser();
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
};

/**
 * Check if token is expired (simplified for mock tokens)
 */
export const isTokenExpired = (token: string): boolean => {
  // For mock/development tokens, never expire
  return !token;
};

/**
 * Format date to readable string
 */
export const formatDate = (date: string | Date): string => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Format date and time to readable string
 */
export const formatDateTime = (date: string | Date): string => {
  if (!date) return '';
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Capitalize first letter of string
 */
export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Get initials from name
 */
export const getInitials = (name: string): string => {
  if (!name) return '';
  const names = name.split(' ');
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
