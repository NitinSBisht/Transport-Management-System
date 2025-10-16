import { createApi } from '@reduxjs/toolkit/query/react'
import { customBaseQuery } from './baseQuery'
import { User, LoginCredentials, RegisterData, AuthResponse } from '../types'

export interface LoginResponse {
  success: boolean
  data?: {
    token: string
    refreshToken?: string
    user: User
  }
  message?: string
}

export interface GetProfileResponse {
  success: boolean
  data?: User
  message?: string
}

// Create the Auth API slice
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: customBaseQuery,
  tagTypes: ['Auth', 'User'],
  endpoints: (builder) => ({
    // Login
    login: builder.mutation<LoginResponse, LoginCredentials>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: {
          payload: credentials
        },
      }),
      invalidatesTags: ['Auth'],
    }),

    // Register
    register: builder.mutation<LoginResponse, RegisterData>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['Auth'],
    }),

    // Forgot Password
    forgotPassword: builder.mutation<AuthResponse, { email: string }>({
      query: (data) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: data,
      }),
    }),

    // Reset Password
    resetPassword: builder.mutation<
      AuthResponse,
      { token: string; password: string }
    >({
      query: (data) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: data,
      }),
    }),

    // Change Password
    changePassword: builder.mutation<
      AuthResponse,
      { oldPassword: string; newPassword: string }
    >({
      query: (data) => ({
        url: '/auth/change-password',
        method: 'POST',
        body: data,
      }),
    }),

    // Logout
    logout: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
        body: {},
      }),
      invalidatesTags: ['Auth'],
    }),

    // Get Profile
    getProfile: builder.query<GetProfileResponse, void>({
      query: () => ({ url: '/auth/profile' }),
      providesTags: ['User'],
    }),

    // Update Profile
    updateProfile: builder.mutation<AuthResponse, Partial<User>>({
      query: (userData) => ({
        url: '/auth/profile',
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
  }),
})

// Export hooks
export const {
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
} = authApi

// Export for use in store
export default authApi
