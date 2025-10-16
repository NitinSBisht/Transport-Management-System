import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from './baseQuery';

export interface SuperAdminProfile {
  id: number | string;
  firstName: string;
  lastName: string;
  icon?: string | null;
  credential: {
    email: string;
    phoneNumber: string;
    status: 'active' | 'inactive';
  };
  createdAt?: string;
  updatedAt?: string;
}

interface SuperAdminProfileResponse {
  success: boolean;
  message: string;
  data: SuperAdminProfile;
}

// Create the Super Admin API slice
export const superAdminApi = createApi({
  reducerPath: 'superAdminApi',
  baseQuery: customBaseQuery,
  tagTypes: ['SuperAdminProfile'],
  endpoints: (builder) => ({
    // Get super admin profile
    getSuperAdminProfile: builder.query<SuperAdminProfileResponse, void>({
      query: () => ({
        url: '/super-admins/profile',
        method: 'GET',
      }),
      providesTags: ['SuperAdminProfile'],
    }),
  }),
});

// Export hooks
export const {
  useGetSuperAdminProfileQuery,
} = superAdminApi;

// Export for use in store
export default superAdminApi;
