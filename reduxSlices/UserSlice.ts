import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Reducer} from 'redux';
import Geolocation from 'react-native-geolocation-service';
import {requestLocationPermission} from '../app/common/permissions/location';
import {Alert} from 'react-native';


export interface IUserLocation {
  lat: number;
  lng: number;
}
export interface IUserDetails {
  isLoggedIn: boolean;
  accessToken: string;
  userDetails: {
    location?: IUserLocation;
  };
  isFetchingLocation: boolean;
  locationError?: string;
}

export const fetchUserLocation = createAsyncThunk<IUserLocation>(
  'user/fetchUserLocation',
  async (_, {rejectWithValue}) => {
    try {
      const granted = await requestLocationPermission();
      if (!granted) {
        Alert.alert(
          'Permission Denied',
          'Cannot fetch nearby stores without location access.',
        );
        return rejectWithValue('Permission denied');
      }

      const position = await new Promise<Geolocation.GeoPosition>(
        (resolve, reject) => {
          Geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 10000,
          });
        },
      );

      const {latitude, longitude} = position.coords;
      console.log('in userSlice', latitude, longitude);
      return {lat: latitude, lng: longitude};
    } catch (error) {
      console.error('Error fetching location:', error);
      return rejectWithValue('Unable to fetch location');
    }
  },
);

interface UserState {
  isLoggedIn: boolean;
  accessToken: string;
  userDetails: {
    location?: IUserLocation;
  };
  isFetchingLocation: boolean;
  locationError?: string;
}

const initialState: UserState = {
  isLoggedIn: false,
  accessToken: '',
  userDetails: {},
   isFetchingLocation: false,
  locationError: undefined,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUserDetails(
      state,
      action: PayloadAction<
        Partial<Omit<UserState, 'userDetails'>> & {
          userDetails?: UserState['userDetails'];
        }
      >,
    ) {
      state.isLoggedIn = action.payload.isLoggedIn ?? state.isLoggedIn;
      state.accessToken = action.payload.accessToken ?? state.accessToken;
      state.userDetails = action.payload.userDetails ?? state.userDetails ?? {};
    },
  },
  extraReducers: builder => {
     builder.addCase(fetchUserLocation.pending, (state) => {
      state.isFetchingLocation = true;
      state.locationError = undefined;
    });
    builder.addCase(fetchUserLocation.fulfilled, (state, action) => {
      if (!state.userDetails) state.userDetails = {};
      state.userDetails.location = action.payload;
    });
    builder.addCase(fetchUserLocation.rejected, state => {
      if (!state.userDetails) state.userDetails = {};
      state.userDetails.location = undefined;
    });
  },
});

const userReducer: Reducer = userSlice.reducer;

export const {updateUserDetails} = userSlice.actions;
export default userReducer;
