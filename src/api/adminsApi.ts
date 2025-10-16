import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from './baseQuery';

export interface AdminData {
  id?: number | string;
  organisationName: string;
  dotNumber: string;
  mcNumber: string;
  taxId: string;
  website: string;
  logo?: string | null;
  ownerName: string;
  ownerEmail: string;
  ownerPhoneNumber: string;
  planType?: string;
  subscriptionExpiresAt?: string | null;
  credential?: {
    email: string;
    phoneNumber: string;
    status: 'active' | 'inactive';
  };
  address?: {
    streetNumber: string;
    streetName: string;
    country: string;
    state: string;
    city: string;
    zipCode: string;
    address: string; // This is the address line from API
    latitude: number;
    longitude: number;
    placeId: string;
    fullAddress?: string;
  };
  // Flattened fields for form compatibility
  email?: string;
  phoneNumber?: string;
  streetNumber?: string;
  streetName?: string;
  country?: string;
  state?: string;
  city?: string;
  zipCode?: string;
  addressLine?: string; // Renamed to avoid conflict
  latitude?: string | number;
  longitude?: string | number;
  placeId?: string;
  status?: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminsListResponse {
  status: string;
  message: string;
  data?: {
    admins: AdminData[];
    pagination: {
      totalRecords: number;
      totalPages: number;
      page: number;
      limit: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}

export interface AdminResponse {
  success: boolean;
  data?: AdminData;
  message?: string;
}

export interface GetAdminsParams {
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateAdminRequest {
  organisationName: string;
  dotNumber: string;
  mcNumber: string;
  taxId: string;
  email: string;
  phoneNumber: string;
  website: string;
  streetNumber: string;
  streetName: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  address: string;
  latitude: string;
  longitude: string;
  placeId: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhoneNumber: string;
  logo?: string | null; // Base64 string or URL
}

export interface UpdateAdminRequest extends Partial<CreateAdminRequest> {
  id: string | number;
}

// Create the Admins API slice
export const adminsApi = createApi({
  baseQuery: customBaseQuery,
  tagTypes: ['Admins', 'Admin'],
  endpoints: (builder) => ({
    // Get all admins with pagination and search
    getAdmins: builder.query<AdminsListResponse, GetAdminsParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params && 'search' in params && params.search) queryParams.append('search', params.search);
        if (params && 'page' in params && params.page) queryParams.append('page', params.page.toString());
        if (params && 'limit' in params && params.limit) queryParams.append('limit', params.limit.toString());
        
        return {
          url: `/admins${queryParams.toString() ? `?${queryParams.toString()}` : ''}`,
          method: 'GET',
        };
      },
      providesTags: ['Admins'],
    }),

    // Get admin profile (logged-in admin)
    getAdminProfile: builder.query<AdminResponse, void>({
      query: () => ({
        url: '/admins/profile',
        method: 'GET',
      }),
      providesTags: ['Admin'],
    }),

    // Get admin by ID
    getAdminById: builder.query<AdminResponse, string>({
      query: (id) => ({
        url: `/admins/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'Admin', id }],
    }),

    // Create new admin
    createAdmin: builder.mutation<AdminResponse, CreateAdminRequest>({
      query: (adminData) => {
        // Always send as FormData
        const formData = new FormData();
        
        Object.entries(adminData).forEach(([key, value]) => {
          if (value !== null && value !== undefined && value !== '') {
            if (key === 'logo' && typeof value === 'string' && value.startsWith('data:')) {
              // Convert base64 to Blob for logo
              const base64Data = value.split(',')[1];
              const mimeType = value.split(':')[1].split(';')[0];
              
              // Determine file extension from MIME type
              const extension = mimeType.split('/')[1] || 'jpg';
              const filename = `logo.${extension}`;
              
              const byteCharacters = atob(base64Data);
              const byteNumbers = new Array(byteCharacters.length);
              for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
              }
              const byteArray = new Uint8Array(byteNumbers);
              const blob = new Blob([byteArray], { type: mimeType });
              formData.append(key, blob, filename);
            } else {
              formData.append(key, value as string);
            }
          }
        });
        
        return {
          url: '/admins/register',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Admins'],
    }),

    // Update admin
    updateAdmin: builder.mutation<AdminResponse, UpdateAdminRequest>({
      query: ({ id, ...adminData }) => {
        const adminId = String(id);
        // Always send as FormData
        const formData = new FormData();
        
        Object.entries(adminData).forEach(([key, value]) => {
          if (value !== null && value !== undefined && value !== '') {
            if (key === 'logo' && typeof value === 'string' && value.startsWith('data:')) {
              // Convert base64 to Blob for logo
              const base64Data = value.split(',')[1];
              const mimeType = value.split(':')[1].split(';')[0];
              
              // Determine file extension from MIME type
              const extension = mimeType.split('/')[1] || 'jpg';
              const filename = `logo.${extension}`;
              
              const byteCharacters = atob(base64Data);
              const byteNumbers = new Array(byteCharacters.length);
              for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
              }
              const byteArray = new Uint8Array(byteNumbers);
              const blob = new Blob([byteArray], { type: mimeType });
              formData.append(key, blob, filename);
            } else {
              formData.append(key, value as string);
            }
          }
        });
        
        return {
          url: `/admins/profile?id=${adminId}`,
          method: 'PUT',
          body: formData,
        };
      },
      invalidatesTags: (_result, _error, { id }) => ['Admins', { type: 'Admin', id: String(id) }],
    }),

    // Delete admin
    deleteAdmin: builder.mutation<AdminResponse, string>({
      query: (id) => ({
        url: `/admins/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Admins'],
    }),

    // Toggle admin status
    toggleAdminStatus: builder.mutation<AdminResponse, { id: string; status: 'active' | 'inactive' }>({
      query: ({ id, status }) => ({
        url: `/admins/${id}/status`,
        method: 'PATCH',
        body: {
          payload: { status },
        },
      }),
      invalidatesTags: (_result, _error, { id }) => ['Admins', { type: 'Admin', id }],
    }),
  }),
});

// Export hooks
export const {
  useGetAdminsQuery,
  useGetAdminProfileQuery,
  useGetAdminByIdQuery,
  useCreateAdminMutation,
  useUpdateAdminMutation,
  useDeleteAdminMutation,
  useToggleAdminStatusMutation,
} = adminsApi;

// Export for use in store
export default adminsApi;
