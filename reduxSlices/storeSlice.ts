// src/redux/storeSlice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface StoreData {
  id: string | number;
  name: string;
  logo: string;
  location:string;
  latitude:number;
  longitude:number;
  status:string;
  distance: number;
}

interface StoreState {
  stores: StoreData[];
}

const initialState: StoreState = {
  stores: [],
};

export const storeSlice = createSlice({
  name: 'storeData',
  initialState,
  reducers: {
    setStores: (state, action: PayloadAction<StoreData[]>) => {
      state.stores = action.payload;
    },
    clearStores: state => {
      state.stores = [];
    },
  },
});

export const {setStores, clearStores} = storeSlice.actions;
export default storeSlice.reducer;
