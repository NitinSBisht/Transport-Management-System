import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { login, logout as logoutService } from '../../services/authService';
import { setToken, setUser, clearAuthData, getToken, getUser } from '../../utils/helpers';
import { User } from '../../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Async thunks
export const loginUser = createAsyncThunk<
  { user: User; token: string; message?: string },
  { email: string; password: string; role: number; rememberMe: boolean },
  { rejectValue: string }
>('auth/login', async ({ email, password, role, rememberMe }, { rejectWithValue }) => {
  try {
    const result = await login(email, password, role, rememberMe);
    if (result.success && result.data) {
      return { ...result.data, message: result.message };
    }
    return rejectWithValue(result.error);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await logoutService();
  clearAuthData();
});

export const checkAuth = createAsyncThunk('auth/check', async () => {
  const token = getToken();
  const userData = getUser();

  if (token && userData) {
    return userData;
  }
  clearAuthData();
  throw new Error('Not authenticated');
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.error = null;
      setToken(action.payload.token);
      setUser(action.payload.user);
    },
    clearCredentials: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      clearAuthData();
    },
    updateUserData: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      setUser(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
        state.isAuthenticated = false;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setCredentials, clearCredentials, updateUserData } = authSlice.actions;
export default authSlice.reducer;
