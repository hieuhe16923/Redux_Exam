import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Kiểu dữ liệu của từng breed
interface BreedAttributes {
  name: string;
  description?: string;
  hypoallergenic?: boolean;
  life?: { min: number; max: number };
  female_weight?: { min: number; max: number };
}

export interface Breed {
  id: string;
  attributes: BreedAttributes;
}

// Metadata phân trang
interface PaginationMeta {
  current: number;
  records: number;
  next?: string;
  last?: string;
}

// Kiểu state Redux
interface BreedsState {
  list: Breed[];
  loading: boolean;
  error: string | null;
  pagination: PaginationMeta | null;
}

// State khởi tạo
const initialState: BreedsState = {
  list: [],
  loading: false,
  error: null,
  pagination: null,
};

// Thunk fetch API (chỉ lấy 2 mục mỗi trang)
export const fetchBreeds = createAsyncThunk(
  'breeds/fetchBreeds',
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const response = await fetch(`https://dogapi.dog/api/v2/breeds?page[number]=${page}&page[size]=10`);
      if (!response.ok) {
        return rejectWithValue('Failed to fetch breeds');
      }
      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Slice Redux
const breedsSlice = createSlice({
  name: 'breeds',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBreeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBreeds.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.list = action.payload.data;
        state.pagination = {
          current: action.payload.meta.pagination.current,
          records: action.payload.meta.pagination.records,
          next: action.payload.links?.next,
          last: action.payload.links?.last,
        };
      })
      .addCase(fetchBreeds.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Something went wrong';
      });
  }
});

export default breedsSlice.reducer;
