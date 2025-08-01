import { configureStore } from "@reduxjs/toolkit";
import breedsReducer from "../features/breeds/breedsSlice.ts";
import breedDetailsReducer from "../features/breeds/breedDetailsSlice.ts";
import factsReducer from "../features/facts/factsSlice.ts";
import groupsReducer from "../features/groups/groupsSlice.ts";
import groupDetailsReducer from "../features/groups/groupDetailsSlice.ts";
import breedDetailsMapReducer from "../features/breeds/breedDetailsMapSlice.ts";

export const store = configureStore({
  reducer: {
    breeds: breedsReducer,
    breedDetails: breedDetailsReducer,
    facts: factsReducer,
    groups: groupsReducer,
    groupDetails: groupDetailsReducer,
    breedDetailsMap: breedDetailsMapReducer,
  },
});

// Kiểu cho TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
