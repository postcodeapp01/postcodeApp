import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../Store';
import axiosInstance from '../config/Api';
import { calculateDistance } from '../app/common/utils/distanceCalculator';

// ---------- Types ----------
export type Address = {
  id: string;
  name: string;
  label?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  phone: string;
  lat?: number;
  lng?: number;
  isDefault?: boolean;
};

type AddressesState = {
  items: Address[];
  loading: boolean;
  refreshing: boolean;
  markingDefault: boolean; // Add this for better UX
  error: string | null;
   nearestAutoSelected: boolean;
};

const initialState: AddressesState = {
  items: [],
  loading: false,
  refreshing: false,
  markingDefault: false, // Add this
  error: null,
  nearestAutoSelected: false,
};

// ---------- Helpers ----------
const normalizeAddress = (addr: any): Address => ({
  id: String(addr.id),
  name: addr.name,
  label: addr.label,
  addressLine1: addr.addressLine1,
  addressLine2: addr.addressLine2 || '',
  city: addr.city,
  state: addr.state,
  country: addr.country,
  pincode: addr.pincode,
  phone: addr.phone,
  lat: addr.lat ? parseFloat(addr.lat) : undefined,
  lng: addr.lng ? parseFloat(addr.lng) : undefined,
  isDefault: Boolean(addr.isDefault),
});

// ---------- Async thunks ----------
// export const fetchAddresses = createAsyncThunk<Address[]>(
//   'addresses/fetchAll',
//   async (_, {rejectWithValue}) => {
//     try {
//       const {data} = await axiosInstance.get('/address');
//       return (data.address ?? []).map(normalizeAddress);
//     } catch (err: any) {
//       return rejectWithValue(
//         err.response?.data?.message || 'Failed to load addresses',
//       );
//     }
//   },
// );
export const fetchAddresses = createAsyncThunk<
  Address[],
  void,
  { state: RootState; dispatch: any }
>('addresses/fetchAll', async (_, { getState, dispatch, rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get('/address');
    let addresses: Address[] = (data.address ?? []).map(normalizeAddress);

    const state = getState();
    const userLocation = state.user.userDetails.location;
    const alreadyAutoSelected = state.addresses.nearestAutoSelected;

    if (userLocation && addresses.length > 0 && !alreadyAutoSelected) {
      let nearest: Address | null = null;
      let nearestDistance = Infinity;

      addresses.forEach(addr => {
        if (addr.lat && addr.lng) {
          const distance = calculateDistance(
            addr.lat,
            addr.lng,
            userLocation.lat,
            userLocation.lng
          );

          if (distance < nearestDistance) {
            nearestDistance = distance;
            nearest = addr;
          }
        }
      });

      if (nearest) {
        addresses = addresses.map(addr => ({
          ...addr,
          isDefault: addr.id === nearest?.id,
        }));

        // ✅ Mark nearest as default in backend
        dispatch(markDefault(nearest.id));
        // ✅ Mark that we have already auto-selected once
        dispatch(setNearestAutoSelected(true));
      }
    }

    return addresses;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || 'Failed to load addresses'
    );
  }
});


export const addAddress = createAsyncThunk<Address, Omit<Address, 'id'>>(
  'addresses/add',
  async (newAddress, {rejectWithValue}) => {
    try {
      const {data} = await axiosInstance.post('/address', newAddress);
      return normalizeAddress(data);
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to add address',
      );
    }
  },
);

export const updateAddress = createAsyncThunk<Address, Address>(
  'addresses/update',
  async (address, {rejectWithValue}) => {
    try {
      const {data} = await axiosInstance.put(`/address/${address.id}`, address);
      console.log("updated address",data)
      return normalizeAddress(data);
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to update address',
      );
    }
  },
);

export const deleteAddress = createAsyncThunk<string, string>(
  'addresses/delete',
  async (id, {rejectWithValue}) => {
    try {
      await axiosInstance.delete(`/address/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to delete address',
      );
    }
  },
);

// Updated markDefault thunk with better return type
export const markDefault = createAsyncThunk<string, string>(
  'addresses/markDefault',
  async (id, {rejectWithValue}) => {
    try {
      const {data} = await axiosInstance.patch(`/address/${id}`, {
        isDefault: 1,
      });
      // Return just the ID since we'll handle the state update in the reducer
      return id;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to mark default',
      );
    }
  },
);

// ---------- Slice ----------
const addressesSlice = createSlice({
  name: 'addresses',
  initialState,
  reducers: {
    upsertAddress: (state, action: PayloadAction<Address>) => {
      const idx = state.items.findIndex(a => a.id === action.payload.id);
      if (idx !== -1) {
        state.items[idx] = action.payload;
      } else {
        state.items.push(action.payload);
      }
    },
    setNearestAutoSelected: (state, action: PayloadAction<boolean>) => {
    state.nearestAutoSelected = action.payload;
  }
  },
  extraReducers: builder => {
    // fetchAddresses
    builder.addCase(fetchAddresses.pending, state => {
      state.loading = true;
      state.error = null;
      state.refreshing = state.items.length > 0;
    });
    builder.addCase(
      fetchAddresses.fulfilled,
      (state, action: PayloadAction<Address[]>) => {
        state.loading = false;
        state.refreshing = false;
        state.items = action.payload;
      },
    );
    builder.addCase(fetchAddresses.rejected, (state, action) => {
      state.loading = false;
      state.refreshing = false;
      state.error = action.payload as string;
    });

    // addAddress
    builder.addCase(
      addAddress.fulfilled,
      (state, action: PayloadAction<Address>) => {
        state.items.push(action.payload);
      },
    );

    // updateAddress
    builder.addCase(
      updateAddress.fulfilled,
      (state, action: PayloadAction<Address>) => {
        const idx = state.items.findIndex(a => a.id === action.payload.id);
        if (idx !== -1) {
          state.items[idx] = action.payload;
        }
      },
    );

    // deleteAddress
    builder.addCase(
      deleteAddress.fulfilled,
      (state, action: PayloadAction<string>) => {
        state.items = state.items.filter(a => a.id !== action.payload);
      },
    );

    // markDefault - Fixed implementation
    builder.addCase(markDefault.pending, state => {
      state.markingDefault = true;
      state.error = null;
    });
    builder.addCase(
      markDefault.fulfilled,
      (state, action: PayloadAction<string>) => {
        state.markingDefault = false;
        const targetId = action.payload;
        
        // Update all addresses: unset all defaults first, then set the target as default
        state.items = state.items.map(address => ({
          ...address,
          isDefault: address.id === targetId,
        }));
      },
    );
    builder.addCase(markDefault.rejected, (state, action) => {
      state.markingDefault = false;
      state.error = action.payload as string;
    });
  },
});

// ---------- Selectors ----------
export const selectAddresses = (state: RootState) => state.addresses.items;
export const selectDefaultAddress = (state: RootState) =>
  state.addresses.items.find(a => a.isDefault) ?? null;
export const selectNonDefaultAddresses = (state: RootState) =>
  state.addresses.items.filter(a => !a.isDefault);
export const selectAddressesLoading = (state: RootState) =>
  state.addresses.loading;
export const selectAddressesRefreshing = (state: RootState) =>
  state.addresses.refreshing;
export const selectMarkingDefault = (state: RootState) =>
  state.addresses.markingDefault;

export const {upsertAddress,setNearestAutoSelected } = addressesSlice.actions;
export default addressesSlice.reducer;
