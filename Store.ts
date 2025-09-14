import { configureStore } from '@reduxjs/toolkit';
import userReducer, { fetchUserLocation } from './reduxSlices/UserSlice';
import storeReducer from './reduxSlices/storeSlice';
import productReducer from './reduxSlices/productSlice';
import categoriesReducer from './reduxSlices/categorySlice';
import addressesReducer from './reduxSlices/addressesSlice'
export const store = configureStore({
  reducer: {
    user: userReducer,
    storeData:storeReducer,
    productsData:productReducer,
    categories:categoriesReducer,
    addresses: addressesReducer,
  },
})
store.dispatch(fetchUserLocation());
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch