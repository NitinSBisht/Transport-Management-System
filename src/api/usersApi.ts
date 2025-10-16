import { createApi } from '@reduxjs/toolkit/query/react'
import { customBaseQuery } from './baseQuery'
import { User, UserRole } from '../types'

export interface UsersResponse {
  success: boolean
  data?: User[]
  message?: string
}

export interface UserResponse {
  success: boolean
  data?: User
  message?: string
}

export interface CreateUserRequest {
  name: string
  email: string
  password: string
  role: UserRole
}

export interface UpdateUserRequest {
  id: string
  name?: string
  email?: string
  role?: UserRole
}

// Create the Users API slice
export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: customBaseQuery,
  tagTypes: ['Users', 'User'],
  endpoints: (builder) => ({
    // Get all users
    getUsers: builder.query<UsersResponse, void>({
      query: () => ({ url: '/users' }),
      providesTags: ['Users'],
    }),

    // Get users by role
    getUsersByRole: builder.query<UsersResponse, UserRole>({
      query: (role) => ({ url: `/users/role/${role}` }),
      providesTags: ['Users'],
    }),

    // Get user by ID
    getUserById: builder.query<UserResponse, string>({
      query: (id) => ({ url: `/users/${id}` }),
      providesTags: (_result, _error, id) => [{ type: 'User', id }],
    }),

    // Create user
    createUser: builder.mutation<UserResponse, CreateUserRequest>({
      query: (userData) => ({
        url: '/users',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['Users'],
    }),

    // Update user
    updateUser: builder.mutation<UserResponse, UpdateUserRequest>({
      query: ({ id, ...userData }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        'Users',
        { type: 'User', id },
      ],
    }),

    // Delete user
    deleteUser: builder.mutation<UserResponse, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users'],
    }),

    // Get admins
    getAdmins: builder.query<UsersResponse, void>({
      query: () => ({ url: '/users/role/admin' }),
      providesTags: ['Users'],
    }),

    // Get dispatchers
    getDispatchers: builder.query<UsersResponse, void>({
      query: () => ({ url: '/users/role/dispatcher' }),
      providesTags: ['Users'],
    }),
  }),
})

// Export hooks
export const {
  useGetUsersQuery,
  useGetUsersByRoleQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetAdminsQuery,
  useGetDispatchersQuery,
} = usersApi

// Export for use in store
export default usersApi
