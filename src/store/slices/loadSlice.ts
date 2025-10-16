import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Load, LoadStatus } from '../../types';

interface LoadState {
  loads: Load[];
  selectedLoad: Load | null;
  loading: boolean;
  error: string | null;
}

const initialState: LoadState = {
  loads: [],
  selectedLoad: null,
  loading: false,
  error: null,
};

// Mock data for demonstration
const mockLoads: Load[] = [
  {
    id: 'LD-1001',
    origin: 'New York, NY',
    destination: 'Boston, MA',
    status: 'in_transit',
    dispatcher: 'Mike Johnson',
    dispatcherId: '3',
    weight: '15,000 lbs',
    distance: '215 miles',
    pickupTime: '08:00 AM',
    deliveryTime: '02:00 PM',
    notes: 'Handle with care - fragile items',
  },
  {
    id: 'LD-1002',
    origin: 'Chicago, IL',
    destination: 'Detroit, MI',
    status: 'assigned',
    dispatcher: 'Sarah Smith',
    dispatcherId: '3',
    weight: '12,500 lbs',
    distance: '280 miles',
    pickupTime: '10:00 AM',
    deliveryTime: '04:00 PM',
  },
  {
    id: 'LD-1003',
    origin: 'Los Angeles, CA',
    destination: 'San Diego, CA',
    status: 'pending',
    dispatcher: 'Unassigned',
    weight: '18,000 lbs',
    distance: '120 miles',
  },
];

// Async thunks
export const fetchLoads = createAsyncThunk('loads/fetchAll', async () => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockLoads;
});

export const fetchLoadById = createAsyncThunk<Load, string>(
  'loads/fetchById',
  async (loadId: string) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const load = mockLoads.find((l) => l.id === loadId);
    if (!load) throw new Error('Load not found');
    return load;
  }
);

export const updateLoadStatus = createAsyncThunk<
  { id: string; status: LoadStatus },
  { id: string; status: LoadStatus }
>('loads/updateStatus', async ({ id, status }) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { id, status };
});

const loadSlice = createSlice({
  name: 'loads',
  initialState,
  reducers: {
    setSelectedLoad: (state, action: PayloadAction<Load | null>) => {
      state.selectedLoad = action.payload;
    },
    clearLoads: (state) => {
      state.loads = [];
      state.selectedLoad = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all loads
      .addCase(fetchLoads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLoads.fulfilled, (state, action) => {
        state.loading = false;
        state.loads = action.payload;
      })
      .addCase(fetchLoads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch loads';
      })
      // Fetch load by ID
      .addCase(fetchLoadById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLoadById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedLoad = action.payload;
      })
      .addCase(fetchLoadById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch load';
      })
      // Update load status
      .addCase(updateLoadStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        const load = state.loads.find((l) => l.id === id);
        if (load) {
          load.status = status;
        }
        if (state.selectedLoad?.id === id) {
          state.selectedLoad.status = status;
        }
      });
  },
});

export const { setSelectedLoad, clearLoads } = loadSlice.actions;
export default loadSlice.reducer;
