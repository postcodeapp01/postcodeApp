// // src/redux/storeSlice.ts
// import {createSlice, PayloadAction} from '@reduxjs/toolkit';

// interface StoreData {
//   id: string | number;
//   name: string;
//   logo: string;
//   location:string;
//   latitude:number;
//   longitude:number;
//   status:string;
//   distance: number;
// }

// interface StoreState {
//   stores: StoreData[];
// }

// const initialState: StoreState = {
//   stores: [],
// };

// export const storeSlice = createSlice({
//   name: 'storeData',
//   initialState,
//   reducers: {
//     setStores: (state, action: PayloadAction<StoreData[]>) => {
//       state.stores = action.payload;
//     },
//     clearStores: state => {
//       state.stores = [];
//     },
//   },
// });

// export const {setStores, clearStores} = storeSlice.actions;
// export default storeSlice.reducer;
// src/redux/storeSlice.ts
import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import { domainUrl } from '../config/Api';

interface StoreData {
  id: string | number;
  name: string;
  logo: string;
  location: string;
  latitude: number;
  longitude: number;
  status: string;
  distance: number;
}

interface StoreState {
  stores: StoreData[];
  loading: boolean;
  error: string | null;
}

const initialState: StoreState = {
  stores: [],
  loading: false,
  error: null,
};

// ✅ Async thunk
export const fetchStores = createAsyncThunk(
  'storeData/fetchStores',
  async (_, {rejectWithValue}) => {
    try {
      const res = await fetch(`${domainUrl}/stores`);
      const data = await res.json();
      return data; // backend already gives stores
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

export const storeSlice = createSlice({
  name: 'storeData',
  initialState,
  reducers: {
    clearStores: state => {
      state.stores = [];
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchStores.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStores.fulfilled, (state, action: PayloadAction<StoreData[]>) => {
        state.loading = false;
        state.stores = action.payload;
      })
      .addCase(fetchStores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {clearStores} = storeSlice.actions;
export default storeSlice.reducer;
