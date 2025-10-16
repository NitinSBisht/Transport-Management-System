import { createApi } from '@reduxjs/toolkit/query/react'
import { customBaseQuery } from './baseQuery'
import { Load, LoadStatus } from '../types'

export interface LoadsResponse {
  success: boolean
  data?: Load[]
  message?: string
}

export interface LoadResponse {
  success: boolean
  data?: Load
  message?: string
}

export interface CreateLoadRequest {
  origin: string
  destination: string
  weight?: string
  distance?: string
  pickupTime?: string
  deliveryTime?: string
  notes?: string
}

export interface UpdateLoadStatusRequest {
  id: string
  status: LoadStatus
}

export interface AssignLoadRequest {
  loadId: string
  dispatcherId: string
}

// Create the Loads API slice
export const loadsApi = createApi({
  reducerPath: 'loadsApi',
  baseQuery: customBaseQuery,
  tagTypes: ['Loads', 'Load'],
  endpoints: (builder) => ({
    // Get all loads
    getLoads: builder.query<LoadsResponse, void>({
      query: () => ({ url: '/loads' }),
      providesTags: ['Loads'],
    }),

    // Get load by ID
    getLoadById: builder.query<LoadResponse, string>({
      query: (id) => ({ url: `/loads/${id}` }),
      providesTags: (_result, _error, id) => [{ type: 'Load', id }],
    }),

    // Get loads by dispatcher
    getLoadsByDispatcher: builder.query<LoadsResponse, string>({
      query: (dispatcherId) => ({ url: `/loads/dispatcher/${dispatcherId}` }),
      providesTags: ['Loads'],
    }),

    // Create load
    createLoad: builder.mutation<LoadResponse, CreateLoadRequest>({
      query: (loadData) => ({
        url: '/loads',
        method: 'POST',
        body: loadData,
      }),
      invalidatesTags: ['Loads'],
    }),

    // Update load
    updateLoad: builder.mutation<LoadResponse, { id: string } & Partial<Load>>({
      query: ({ id, ...loadData }) => ({
        url: `/loads/${id}`,
        method: 'PUT',
        body: loadData,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        'Loads',
        { type: 'Load', id },
      ],
    }),

    // Update load status
    updateLoadStatus: builder.mutation<LoadResponse, UpdateLoadStatusRequest>({
      query: ({ id, status }) => ({
        url: `/loads/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        'Loads',
        { type: 'Load', id },
      ],
    }),

    // Assign load to dispatcher
    assignLoad: builder.mutation<LoadResponse, AssignLoadRequest>({
      query: ({ loadId, dispatcherId }) => ({
        url: `/loads/${loadId}/assign`,
        method: 'POST',
        body: { dispatcherId },
      }),
      invalidatesTags: ['Loads'],
    }),

    // Delete load
    deleteLoad: builder.mutation<LoadResponse, string>({
      query: (id) => ({
        url: `/loads/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Loads'],
    }),
  }),
})

// Export hooks
export const {
  useGetLoadsQuery,
  useGetLoadByIdQuery,
  useGetLoadsByDispatcherQuery,
  useCreateLoadMutation,
  useUpdateLoadMutation,
  useUpdateLoadStatusMutation,
  useAssignLoadMutation,
  useDeleteLoadMutation,
} = loadsApi

// Export for use in store
export default loadsApi
