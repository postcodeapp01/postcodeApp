import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../Store';
import axiosInstance from '../config/Api';
import { calculateDistance } from '../app/common/utils/distanceCalculator';

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
  isSuggested?: boolean;
};

type AddressesState = {
  items: Address[];
  defaultAddress: Address | null;
  loading: boolean;
  error: string | null;
};

const initialState: AddressesState = {
  items: [],
  defaultAddress: null,
  loading: false,
  error: null,
};

const normalizeAddress = (addr: any): Address => ({
  id: String(addr.id),
  name: addr.name ?? 'Address',
  label: addr.label ?? undefined,
  addressLine1: addr.addressLine1 ?? addr.formattedAddress ?? '',
  addressLine2: addr.addressLine2 ?? '',
  city: addr.city ?? '',
  state: addr.state ?? '',
  country: addr.country ?? '',
  pincode: addr.pincode ?? '',
  phone: addr.phone ?? '',
  lat: addr.lat !== undefined && addr.lat !== null ? Number(addr.lat) : undefined,
  lng: addr.lng !== undefined && addr.lng !== null ? Number(addr.lng) : undefined,
  isDefault: false,
  isSuggested: false,
});

const coordsEqual = (aLat?: number, aLng?: number, bLat?: number, bLng?: number, tol = 1e-6) =>
  typeof aLat === 'number' &&
  typeof aLng === 'number' &&
  typeof bLat === 'number' &&
  typeof bLng === 'number' &&
  Math.abs(aLat - bLat) < tol &&
  Math.abs(aLng - bLng) < tol;

export const fetchAddresses = createAsyncThunk<
  { addresses: Address[]; defaultAddress: Address | null },
  void,
  { state: RootState }
>('addresses/fetchAll', async (_, { getState, rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get('/address');
    let addresses: Address[] = Array.isArray(data?.address)
      ? data.address.map(normalizeAddress)
      : [];

    const serverMarkedDefault = addresses.find((a) => !!a.isDefault);

    const state = getState();
    const userLoc = state.user?.userDetails?.location;
    if (!userLoc || userLoc.lat == null || userLoc.lng == null) {
      return {
        addresses,
        defaultAddress: serverMarkedDefault ?? addresses[0] ?? null,
      };
    }

    const userLat = Number(userLoc.lat);
    const userLng = Number(userLoc.lng);

    if (!Number.isFinite(userLat) || !Number.isFinite(userLng)) {
      return {
        addresses,
        defaultAddress: serverMarkedDefault ?? addresses[0] ?? null,
      };
    }

    const thresholdMeters = 50;
    let nearest: { addr: Address; dist: number } | null = null;

    for (const addr of addresses) {
      if (typeof addr.lat === 'number' && typeof addr.lng === 'number') {
        const dist = calculateDistance(addr.lat, addr.lng, userLat, userLng);
        console.log(dist)
        if (!Number.isFinite(dist)) continue;
        if (dist <= thresholdMeters && (nearest === null || dist < nearest.dist)) {
          nearest = { addr, dist };
        }
      }
    }

    if (nearest) {
      return {
        addresses,
        defaultAddress: nearest.addr,
      };
    }

    try {
      const { data: geocodeData } = await axiosInstance.post('/googlemaps/reverse-geocode', {
        lat: userLat,
        lng: userLng,
      });

      const suggested: Address = {
        id: `suggested-${Date.now()}`,
        name: getState()?.user?.userDetails?.name ?? 'Current Location',
        label: 'Home',
        addressLine1:
          geocodeData?.addressLine1 ??
          geocodeData?.formattedAddress ??
          `${userLat.toFixed(6)}, ${userLng.toFixed(6)}`,
        addressLine2: geocodeData?.addressLine2 ?? '',
        city: geocodeData?.city ?? '',
        state: geocodeData?.state ?? '',
        country: geocodeData?.country ?? '',
        pincode: geocodeData?.pincode ?? '',
        phone: '',
        lat: userLat,
        lng: userLng,
        isDefault: true,
        isSuggested: true,
      };
      addresses = [suggested, ...addresses];

      return {
        addresses,
        defaultAddress: suggested,
      };
    } catch (err) {
      const fallbackSuggested: Address = {
        id: `suggested-${Date.now()}`,
        name: state.user?.userDetails?.name ?? 'Current Location',
        label: 'Current Location',
        addressLine1: `${userLat.toFixed(6)}, ${userLng.toFixed(6)}`,
        addressLine2: '',
        city: '',
        state: '',
        country: '',
        pincode: '',
        phone: '',
        lat: userLat,
        lng: userLng,
        isDefault: true,
        isSuggested: true,
      };
      addresses = [fallbackSuggested, ...addresses];

      return {
        addresses,
        defaultAddress: fallbackSuggested,
      };
    }
  } catch (err: any) {
    return rejectWithValue(err?.response?.data?.message ?? err?.message ?? 'Failed to load addresses');
  }
});

export const addAddress = createAsyncThunk<Address, Omit<Address, 'id'>, { state: RootState }>(
  'addresses/add',
  async (newAddress, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post('/address', newAddress);
      return normalizeAddress(data);
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message ?? err?.message ?? 'Failed to add address');
    }
  }
);

export const updateAddress = createAsyncThunk<Address, Address, { state: RootState }>(
  'addresses/update',
  async (address, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(`/address/${address.id}`, address);
      return normalizeAddress(data);
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message ?? err?.message ?? 'Failed to update address');
    }
  }
);

export const deleteAddress = createAsyncThunk<string, string, { state: RootState }>(
  'addresses/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/address/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message ?? err?.message ?? 'Failed to delete address');
    }
  }
);

const addressesSlice = createSlice({
  name: 'addresses',
  initialState,
  reducers: {
    setDefaultAddress: (state, action: PayloadAction<Address | null>) => {
      state.defaultAddress = action.payload;
    },
    clearDefaultAddress: (state) => {
      state.defaultAddress = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAddresses.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAddresses.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload.addresses;
      state.defaultAddress = action.payload.defaultAddress;
    });
    builder.addCase(fetchAddresses.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) ?? 'Failed to load addresses';
    });

    builder.addCase(addAddress.fulfilled, (state, action: PayloadAction<Address>) => {
      const newAddr = action.payload;
      const suggestedIndex = state.items.findIndex(
        (a) => a.id.startsWith('suggested-') && coordsEqual(a.lat, a.lng, newAddr.lat, newAddr.lng)
      );
      if (suggestedIndex !== -1) {
        const suggested = state.items[suggestedIndex];
        state.items.splice(suggestedIndex, 1);
        if (state.defaultAddress?.id === suggested.id) {
          state.defaultAddress = newAddr;
        }
      }
      state.items.push(newAddr);
    });

    builder.addCase(updateAddress.fulfilled, (state, action: PayloadAction<Address>) => {
      const idx = state.items.findIndex((a) => a.id === action.payload.id);
      if (idx !== -1) {
        state.items[idx] = action.payload;
      }
      if (state.defaultAddress?.id === action.payload.id) {
        state.defaultAddress = action.payload;
      }
    });

    builder.addCase(deleteAddress.fulfilled, (state, action: PayloadAction<string>) => {
      const deletedId = action.payload;
      state.items = state.items.filter((a) => a.id !== deletedId);
      if (state.defaultAddress?.id === deletedId) {
        state.defaultAddress = state.items[0] ?? null;
      }
    });
  },
});

// ---------- Selectors ----------
export const selectAllAddresses = (state: RootState) => state.addresses.items;
export const selectDefaultAddress = (state: RootState) => state.addresses.defaultAddress;
export const selectAddressById = (state: RootState, id: string | null) =>
  state.addresses.items.find((a) => a.id === (id ?? '')) ?? null;
console.log("in addressSlice",selectAddressById,selectDefaultAddress);
// ---------- Exports ----------
export const { setDefaultAddress, clearDefaultAddress } = addressesSlice.actions;
export default addressesSlice.reducer;
