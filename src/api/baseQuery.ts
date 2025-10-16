import {
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'
import toast from 'react-hot-toast'
import { getToken, clearAuthData, setToken } from '../utils/helpers'
import { navigateTo } from '../utils/navigation'
import config from '../config'

const { API_BASE_URL } = config

// Create a module-level flag to track if we're already handling auth errors
let isHandling401Error = false

// Create the base query with fetchBaseQuery
const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { extra, ...api }) => {
    const token = getToken()

    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }

    // Don't set Content-Type - let fetch handle it automatically
    // For FormData, browser sets: Content-Type: multipart/form-data; boundary=...
    // For JSON, fetchBaseQuery sets: Content-Type: application/json
    
    return headers
  },
})

const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = localStorage.getItem('tms_refresh_token')
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    })

    if (!response.ok) {
      throw new Error('Failed to refresh token')
    }

    const data = await response.json()
    const newAccessToken = data?.data?.accessToken
    const newRefreshToken = data?.data?.refreshToken

    if (newAccessToken) {
      setToken(newAccessToken)
      if (newRefreshToken) {
        localStorage.setItem('tms_refresh_token', newRefreshToken)
      }
      return newAccessToken
    }

    throw new Error('No access token in response')
  } catch (error) {
    console.error('Token refresh failed:', error)
    toast.error('Session expired. Please login again.')
    clearAuthData()
    navigateTo('/login', true)
    return null
  }
}

export const customBaseQuery: BaseQueryFn<
  FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const modifiedArgs = { ...args }

  // Make the request
  let result = await baseQuery(modifiedArgs, api, extraOptions)

  // Handle 401 errors with token refresh
  if (result.error) {
    const error = result.error
    const statusCode = error?.status
    const errorData = error.data as Record<string, unknown>

    // Handle token expiration
    if (errorData?.isExpired && !isHandling401Error) {
      isHandling401Error = true

      try {
        const newToken = await refreshAccessToken()

        if (newToken) {
          // Retry the original request with the new token
          const retryArgs = {
            ...modifiedArgs,
            headers: {
              ...modifiedArgs.headers,
              authorization: `Bearer ${newToken}`,
            },
          }

          result = await baseQuery(retryArgs, api, extraOptions)
        }
      } finally {
        isHandling401Error = false
      }
    } else if (statusCode === 401 && !isHandling401Error) {
      isHandling401Error = true
      toast.error('Unauthorized. Please login again.')
      clearAuthData()
      setTimeout(() => {
        navigateTo('/login', true)
        isHandling401Error = false
      }, 1000)
    }
  }

  return result
}
