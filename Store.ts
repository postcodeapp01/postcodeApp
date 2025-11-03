import { configureStore } from '@reduxjs/toolkit';
import userReducer, { fetchUserLocation } from './reduxSlices/UserSlice';
import storeReducer from './reduxSlices/storeSlice';
import productReducer from './reduxSlices/productSlice';
import categoriesReducer from './reduxSlices/categorySlice';
import addressesReducer from './reduxSlices/addressesSlice';
import cartReducer from './reduxSlices/cartSlice';
import orderReducer from './reduxSlices/orderSlice';
import bookmarkReducer from './reduxSlices/bookmarkSlice';
export const store = configureStore({
  reducer: {
    user: userReducer,
    storeData:storeReducer,
    productsData:productReducer,
    categories:categoriesReducer,
    addresses: addressesReducer,
    cart: cartReducer,
    orders:orderReducer,
    bookmarks: bookmarkReducer,
  },
})
store.dispatch(fetchUserLocation());
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch