// src/features/facts/factsSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface Fact {
  id: string;
  attributes: {
    body: string;
  };
}

interface FactsState {
  data: Fact[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: FactsState = {
  data: [],
  status: "idle",
  error: null,
};

export const fetchFacts = createAsyncThunk(
  "facts/fetchFacts",
  async (limit: number = 5, { rejectWithValue }) => {
    try {
      const response = await fetch(`https://dogapi.dog/api/v2/facts?limit=${limit}`);
      if (!response.ok) {
        return rejectWithValue("Failed to fetch facts");
      }
      const json = await response.json();
      return json.data;
    } catch (err: any) {
      return rejectWithValue(err.message || "Network error");
    }
  }
);

const factsSlice = createSlice({
  name: "facts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFacts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchFacts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchFacts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default factsSlice.reducer;
