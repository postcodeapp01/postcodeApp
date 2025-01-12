import { createSlice } from '@reduxjs/toolkit';
import { Reducer } from 'redux';

export interface IUserDetails {
    isLoggedIn: boolean,
    accessToken: string,
    userDetails: any,
}


const userSlice = createSlice({
  name: 'user',
  initialState: {
    isLoggedIn: false,
    accessToken: '',
    userDetails: {},
  },
  reducers: {
    updateUserDetails(state, action) {
      state.isLoggedIn = action.payload.isLoggedIn;
      state.accessToken = action.payload.accessToken;
      state.userDetails = action.payload.userDetails;
    },
  },
});

const userReducer: Reducer = userSlice.reducer;

export const { updateUserDetails } = userSlice.actions;
export default userReducer;
