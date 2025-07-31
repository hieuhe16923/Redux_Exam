import { configureStore } from '@reduxjs/toolkit';
import breedsReducer from '../features/breeds/breedsSlice.ts';

export const store = configureStore({
  reducer: {
    breeds: breedsReducer
  }
});

// ⚠️ Xuất type để dùng cho useSelector và useDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
