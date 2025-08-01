// src/features/groups/groupsSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface BreedRelationship {
  id: string;
  type: string;
}

interface GroupRelationships {
  breeds: {
    data: BreedRelationship[];
  };
}

interface GroupAttributes {
  name: string;
}

export interface Group {
  id: string;
  attributes: GroupAttributes;
  relationships: GroupRelationships;
}

interface GroupsState {
  list: Group[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  currentPage: number;
  totalPages: number;
}

const initialState: GroupsState = {
  list: [],
  status: "idle",
  error: null,
  currentPage: 1,
  totalPages: 1,
};

export const fetchGroups = createAsyncThunk(
  "groups/fetchGroups",
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const res = await fetch(`https://dogapi.dog/api/v2/groups?page[number]=${page}`);
      if (!res.ok) {
        return rejectWithValue("Failed to fetch groups");
      }
      const data = await res.json();
      return {
        data: data.data,
        links: data.links,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);

function getLastPageFromLinks(links: any): number {
  if (!links?.last) return 1;
  const match = links.last.match(/page\[number\]=(\d+)/);
  return match ? parseInt(match[1]) : 1;
}

const groupsSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    goToPage(state, action) {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroups.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload.data;
        state.totalPages = getLastPageFromLinks(action.payload.links);
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { goToPage } = groupsSlice.actions;
export default groupsSlice.reducer;
