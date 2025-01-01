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
      state.userDetails = action.payload;
    },
  },
});

const userReducer: Reducer = userSlice.reducer;

export const { updateUserDetails } = userSlice.actions;
export default userReducer;
