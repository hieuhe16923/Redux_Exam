// src/features/breeds/breedDetailsMapSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface BreedAttributes {
  name: string;
  description?: string;
  hypoallergenic?: boolean;
  life?: { min: number; max: number };
  female_weight?: { min: number; max: number };
  male_weight?: { min: number; max: number };
}

interface Breed {
  id: string;
  attributes: BreedAttributes;
}

interface BreedDetailsMapState {
  breeds: { [id: string]: Breed };
  loading: boolean;
  error: string | null;
}

const initialState: BreedDetailsMapState = {
  breeds: {},
  loading: false,
  error: null,
};

export const fetchBreedById = createAsyncThunk(
  'breedDetailsMap/fetchBreedById',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`https://dogapi.dog/api/v2/breeds/${id}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      return {
        id: data.data.id,
        attributes: data.data.attributes,
      };
    } catch (err: any) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);

const breedDetailsMapSlice = createSlice({
  name: 'breedDetailsMap',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBreedById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBreedById.fulfilled, (state, action: PayloadAction<Breed>) => {
        state.loading = false;
        state.breeds[action.payload.id] = action.payload;
      })
      .addCase(fetchBreedById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default breedDetailsMapSlice.reducer;
