import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from './baseQuery';

export interface DispatcherData {
  id?: number | string;
  firstName: string;
  lastName: string;
  icon?: string | null;
  credential?: {
    email: string;
    phoneNumber: string;
    status: 'active' | 'inactive';
  };
  createdAt?: string;
  updatedAt?: string;
}

interface DispatcherResponse {
  status: string;
  message: string;
  data: DispatcherData;
}

interface DispatchersListResponse {
  status: string;
  message: string;
  data: {
    dispatchers: DispatcherData[];
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

interface GetDispatchersParams {
  admin?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateDispatcherRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  icon?: string | null;
}

export interface UpdateDispatcherRequest extends Partial<CreateDispatcherRequest> {
  id: string | number;
}

// Create the Dispatchers API slice
export const dispatchersApi = createApi({
  reducerPath: 'dispatchersApi',
  baseQuery: customBaseQuery,
  tagTypes: ['Dispatchers', 'Dispatcher'],
  endpoints: (builder) => ({
    // Get all dispatchers with pagination and search
    getDispatchers: builder.query<DispatchersListResponse, GetDispatchersParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params && 'admin' in params && params.admin) queryParams.append('admin', params.admin);
        if (params && 'search' in params && params.search) queryParams.append('search', params.search);
        if (params && 'page' in params && params.page) queryParams.append('page', params.page.toString());
        if (params && 'limit' in params && params.limit) queryParams.append('limit', params.limit.toString());
        
        return {
          url: `/dispatchers${queryParams.toString() ? `?${queryParams.toString()}` : ''}`,
          method: 'GET',
        };
      },
      providesTags: ['Dispatchers'],
    }),

    // Get dispatcher by ID
    getDispatcherById: builder.query<DispatcherResponse, string>({
      query: (id) => ({
        url: `/dispatchers/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'Dispatcher', id }],
    }),

    // Create new dispatcher
    createDispatcher: builder.mutation<DispatcherResponse, CreateDispatcherRequest>({
      query: (dispatcherData) => {
        // Always send as FormData
        const formData = new FormData();
        
        Object.entries(dispatcherData).forEach(([key, value]) => {
          if (value !== null && value !== undefined && value !== '') {
            if (key === 'icon' && typeof value === 'string' && value.startsWith('data:')) {
              // Convert base64 to Blob for icon
              const base64Data = value.split(',')[1];
              const mimeType = value.split(':')[1].split(';')[0];
              
              // Determine file extension from MIME type
              const extension = mimeType.split('/')[1] || 'jpg';
              const filename = `icon.${extension}`;
              
              const byteCharacters = atob(base64Data);
              const byteNumbers = new Array(byteCharacters.length);
              for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
              }
              const byteArray = new Uint8Array(byteNumbers);
              const blob = new Blob([byteArray], { type: mimeType });
              
              // Append icon as blob with the key 'icon'
              formData.append('icon', blob, filename);
            } else {
              formData.append(key, String(value));
            }
          }
        });

        return {
          url: '/dispatchers/register',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Dispatchers'],
    }),

    // Update dispatcher
    updateDispatcher: builder.mutation<DispatcherResponse, UpdateDispatcherRequest>({
      query: ({ id, ...dispatcherData }) => {
        // Always send as FormData
        const formData = new FormData();
        
        Object.entries(dispatcherData).forEach(([key, value]) => {
          if (value !== null && value !== undefined && value !== '') {
            if (key === 'icon' && typeof value === 'string' && value.startsWith('data:')) {
              // Convert base64 to Blob for icon
              const base64Data = value.split(',')[1];
              const mimeType = value.split(':')[1].split(';')[0];
              
              // Determine file extension from MIME type
              const extension = mimeType.split('/')[1] || 'jpg';
              const filename = `icon.${extension}`;
              
              const byteCharacters = atob(base64Data);
              const byteNumbers = new Array(byteCharacters.length);
              for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
              }
              const byteArray = new Uint8Array(byteNumbers);
              const blob = new Blob([byteArray], { type: mimeType });
              
              // Append icon as blob with the key 'icon'
              formData.append('icon', blob, filename);
            } else {
              formData.append(key, String(value));
            }
          }
        });

        return {
          url: `/dispatchers/${id}`,
          method: 'PATCH',
          body: formData,
        };
      },
      invalidatesTags: (_result, _error, { id }) => ['Dispatchers', { type: 'Dispatcher', id }],
    }),

    // Delete dispatcher
    deleteDispatcher: builder.mutation<DispatcherResponse, string>({
      query: (id) => ({
        url: `/dispatchers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Dispatchers'],
    }),

    // Toggle dispatcher status
    toggleDispatcherStatus: builder.mutation<DispatcherResponse, { id: string; status: 'active' | 'inactive' }>({
      query: ({ id, status }) => ({
        url: `/dispatchers/${id}/status`,
        method: 'PATCH',
        body: {
          payload: { status },
        },
      }),
      invalidatesTags: (_result, _error, { id }) => ['Dispatchers', { type: 'Dispatcher', id }],
    }),
  }),
});

// Export hooks
export const {
  useGetDispatchersQuery,
  useGetDispatcherByIdQuery,
  useCreateDispatcherMutation,
  useUpdateDispatcherMutation,
  useDeleteDispatcherMutation,
  useToggleDispatcherStatusMutation,
} = dispatchersApi;

// Export for use in store
export default dispatchersApi;
