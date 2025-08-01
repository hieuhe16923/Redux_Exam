import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface BreedRelation {
  id: string;
  type: string;
}

interface GroupDetail {
  id: string;
  attributes: {
    name: string;
  };
  relationships: {
    breeds: {
      data: BreedRelation[];
    };
  };
}

interface GroupDetailsState {
  data: GroupDetail | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  currentPage: number;
  itemsPerPage: number;
}

const initialState: GroupDetailsState = {
  data: null,
  status: "idle",
  error: null,
  currentPage: 1,
  itemsPerPage: 10,
};

export const fetchGroupDetail = createAsyncThunk(
  "groupDetails/fetchGroupDetail",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`https://dogapi.dog/api/v2/groups/${id}`);
      if (!res.ok) {
        return rejectWithValue("Failed to fetch group detail");
      }
      const json = await res.json();
      return json.data;
    } catch (err: any) {
      return rejectWithValue(err.message || "Network error");
    }
  }
);

const groupDetailsSlice = createSlice({
  name: "groupDetails",
  initialState,
  reducers: {
    setGroupPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroupDetail.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.currentPage = 1; // reset page mỗi lần fetch
      })
      .addCase(fetchGroupDetail.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchGroupDetail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { setGroupPage } = groupDetailsSlice.actions;

export default groupDetailsSlice.reducer;
// Lấy danh sách breed đang ở trang hiện tại
export const selectCurrentBreedsPage = (state: { groupDetails: GroupDetailsState }) => {
  const breeds = state.groupDetails.data?.relationships?.breeds?.data || [];
  const start = (state.groupDetails.currentPage - 1) * state.groupDetails.itemsPerPage;
  const end = start + state.groupDetails.itemsPerPage;
  return breeds.slice(start, end);
};

// Tổng số trang
export const selectTotalBreedPages = (state: { groupDetails: GroupDetailsState }) => {
  const total = state.groupDetails.data?.relationships?.breeds?.data?.length || 0;
  return Math.ceil(total / state.groupDetails.itemsPerPage);
};
