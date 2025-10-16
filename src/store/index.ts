import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import authReducer, { checkAuth } from './slices/authSlice'
import loadReducer from './slices/loadSlice'
import userReducer from './slices/userSlice'
import chatReducer from './slices/chatSlice'

// RTK Query APIs
import { authApi } from '../api/authApi'
import { loadsApi } from '../api/loadsApi'
import { usersApi } from '../api/usersApi'
import { adminsApi } from '../api/adminsApi'
import { superAdminApi } from '../api/superAdminApi'
import { dispatchersApi } from '../api/dispatchersApi'

export const store = configureStore({
  reducer: {
    // Regular slices
    auth: authReducer,
    loads: loadReducer,
    users: userReducer,
    chat: chatReducer,
    
    // RTK Query API slices
    [authApi.reducerPath]: authApi.reducer,
    [loadsApi.reducerPath]: loadsApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [adminsApi.reducerPath]: adminsApi.reducer,
    [superAdminApi.reducerPath]: superAdminApi.reducer,
    [dispatchersApi.reducerPath]: dispatchersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(authApi.middleware)
      .concat(loadsApi.middleware)
      .concat(usersApi.middleware)
      .concat(adminsApi.middleware)
      .concat(superAdminApi.middleware)
      .concat(dispatchersApi.middleware),
})

// Check authentication once on app initialization
store.dispatch(checkAuth())

// Disable automatic refetching to prevent unnecessary API calls
// Only enable if you want automatic background refetching
// setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
