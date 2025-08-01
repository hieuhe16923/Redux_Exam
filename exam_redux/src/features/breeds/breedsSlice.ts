import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Kiểu dữ liệu của từng breed
interface BreedAttributes {
  name: string;
  description?: string;
  hypoallergenic?: boolean;
  life?: { min: number; max: number };
  male_weight?: { min: number; max: number };
  female_weight?: { min: number; max: number };
}

interface BreedRelationships {
  group?: {
    id: string;
    type: string;
  };
}

export interface Breed {
  id: string;
  attributes: BreedAttributes;
  relationships?: BreedRelationships;
}

// Metadata phân trang
interface PaginationMeta {
  current: number;
  records: number;
  total_pages: number;
  next?: string;
  last?: string;
}

// Redux state
interface BreedsState {
  list: Breed[];
  loading: boolean;
  error: string | null;
  pagination: PaginationMeta | null;
}

// Initial state
const initialState: BreedsState = {
  list: [],
  loading: false,
  error: null,
  pagination: null,
};

// Async thunk
export const fetchBreeds = createAsyncThunk(
  'breeds/fetchBreeds',
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const res = await fetch(`https://dogapi.dog/api/v2/breeds?page[number]=${page}&page[size]=10`);
      if (!res.ok) return rejectWithValue('Failed to fetch breeds');
      const data = await res.json();
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);

// Slice
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

        // Đảm bảo mapping đúng
        state.list = action.payload.data.map((item: any) => ({
          id: item.id,
          attributes: item.attributes,
          relationships: {
            group: item.relationships?.group?.data || undefined,
          },
        }));

        const pagination = action.payload.meta?.pagination;

        state.pagination = {
          current: pagination?.current || 1,
          records: pagination?.records || 0,
          total_pages: pagination?.total_pages || 1,
          next: action.payload.links?.next,
          last: action.payload.links?.last,
        };
      })
      .addCase(fetchBreeds.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Something went wrong';
      });
  },
});

export default breedsSlice.reducer;
