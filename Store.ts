import { configureStore } from '@reduxjs/toolkit';
import userReducer from './reduxSlices/UserSlice';
import storeReducer from './reduxSlices/storeSlice';
import productReducer from './reduxSlices/productSlice';
import categoriesReducer from './reduxSlices/categorySlice';
export const store = configureStore({
  reducer: {
    user: userReducer,
    storeData:storeReducer,
    productsData:productReducer,
    categories:categoriesReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch