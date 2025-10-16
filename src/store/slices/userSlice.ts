import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';

interface UserState {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
};

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    email: 'superadmin@tms.com',
    name: 'Super Admin',
    role: 'superadmin',
  },
  {
    id: '2',
    email: 'admin@tms.com',
    name: 'Admin User',
    role: 'admin',
  },
  {
    id: '3',
    email: 'dispatcher@tms.com',
    name: 'Dispatcher User',
    role: 'dispatcher',
  },
  {
    id: '4',
    email: 'john@tms.com',
    name: 'John Smith',
    role: 'admin',
  },
  {
    id: '5',
    email: 'sarah@tms.com',
    name: 'Sarah Johnson',
    role: 'dispatcher',
  },
];

// Async thunks
export const fetchUsers = createAsyncThunk('users/fetchAll', async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockUsers;
});

export const fetchUserById = createAsyncThunk<User, string>(
  'users/fetchById',
  async (userId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const user = mockUsers.find((u) => u.id === userId);
    if (!user) throw new Error('User not found');
    return user;
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload;
    },
    clearUsers: (state) => {
      state.users = [];
      state.selectedUser = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      })
      // Fetch user by ID
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user';
      });
  },
});

export const { setSelectedUser, clearUsers } = userSlice.actions;
export default userSlice.reducer;
