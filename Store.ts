import { configureStore } from '@reduxjs/toolkit';
import userReducer from './reduxSlices/UserSlice';
import storeReducer from './reduxSlices/storeSlice';
import productReducer from './reduxSlices/productSlice';
export const store = configureStore({
  reducer: {
    user: userReducer,
    storeData:storeReducer,
    productsData:productReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch