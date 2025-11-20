import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Reducer } from 'redux';
import Geolocation from 'react-native-geolocation-service';
import { requestLocationPermission } from '../app/common/permissions/location';
import { Alert } from 'react-native';

export interface IUserLocation { lat: number; lng: number; }

interface UserState {
  isLoggedIn: boolean;
  accessToken: string;
  userDetails: {
    name?: string;
    location?: IUserLocation;
  };
  isFetchingLocation: boolean;
  locationError?: string | null;
  locationPermission:boolean;
}

const initialState: UserState = {
  isLoggedIn: false,
  accessToken: '',
  userDetails: {},
  isFetchingLocation: false,
  locationError: null,
  locationPermission:false,
};

export const fetchUserLocation = createAsyncThunk<
  IUserLocation,
  void,
  { rejectValue: string }
>('user/fetchUserLocation', async (_, { rejectWithValue }) => {
  try {
    const granted = await requestLocationPermission();
    if (!granted) {
      Alert.alert('Permission Denied', 'Cannot fetch nearby stores without location access.');
      return rejectWithValue('Permission denied');
    }

    const position = await new Promise<Geolocation.GeoPosition>((resolve, reject) => {
      Geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      });
    });

    const { latitude, longitude } = position.coords;
    return { lat: latitude, lng: longitude };
  } catch (error) {
    console.error('Error fetching location:', error);
    return rejectWithValue('Unable to fetch location');
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUserDetails(state, action: PayloadAction<Partial<UserState> & { userDetails?: UserState['userDetails'] }>) {
      state.isLoggedIn = action.payload.isLoggedIn ?? state.isLoggedIn;
      state.accessToken = action.payload.accessToken ?? state.accessToken;
      state.userDetails = { ...(state.userDetails || {}), ...(action.payload.userDetails || {}) };
    },
    logout(state) {
      state.isLoggedIn = false;
      state.accessToken = '';
      state.userDetails = {};
      state.isFetchingLocation = false;
      state.locationError = null;
      state.locationPermission=false;
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchUserLocation.pending, (state) => {
      state.isFetchingLocation = true;
      state.locationPermission=false;
      state.locationError = null;
    });
    builder.addCase(fetchUserLocation.fulfilled, (state, action) => {
      state.isFetchingLocation = false;
      state.locationPermission=true;
      if (!state.userDetails) state.userDetails = {};
      state.userDetails.location = action.payload;
      state.locationError = null;
    });
    builder.addCase(fetchUserLocation.rejected, (state, action) => {
      state.isFetchingLocation = false;
      state.locationPermission=false;
      state.locationError = action.payload ?? action.error.message ?? 'Unknown error';
      if (!state.userDetails) state.userDetails = {};
      state.userDetails.location = undefined;
    });
  },
});

export const { updateUserDetails,logout } = userSlice.actions;
const userReducer: Reducer = userSlice.reducer;
export default userReducer;
