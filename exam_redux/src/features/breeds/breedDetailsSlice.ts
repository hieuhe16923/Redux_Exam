import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Kiểu dữ liệu của breed
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

interface BreedDetailsState {
  data: Breed | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: BreedDetailsState = {
  data: null,
  loading: false,
  error: null,
};

// Async thunk to fetch breed by ID
export const fetchBreedById = createAsyncThunk(
  'breeds/fetchBreedById',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`https://dogapi.dog/api/v2/breeds/${id}`);
      if (!res.ok) {
        return rejectWithValue('Failed to fetch breed details');
      }
      const response = await res.json();

      // Chuyển đổi dữ liệu thành đúng kiểu Breed
      const raw = response.data;

      const breed: Breed = {
        id: raw.id,
        attributes: raw.attributes,
        relationships: {
          group: raw.relationships?.group?.data,
        },
      };

      return breed;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);

// Slice
const breedDetailsSlice = createSlice({
  name: 'breedDetails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBreedById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.data = null;
      })
      .addCase(fetchBreedById.fulfilled, (state, action: PayloadAction<Breed>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchBreedById.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Something went wrong';
      });
  }
});

export default breedDetailsSlice.reducer;
