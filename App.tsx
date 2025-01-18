/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import type {PropsWithChildren} from 'react';
import {
  StatusBar,
  useColorScheme,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux'
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './navigators/stacks/AuthStack';
import { updateUserDetails } from './reduxSlices/UserSlice';
import { RootState } from './Store';
import { getItemFromAsyncStorag, getUserDetails } from './app/auth/authServices/AuthServices';

export default function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const userDetails = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   (async function() {
  //     const accessToken = await getItemFromAsyncStorag('accessToken') || '';
  //     if(accessToken) {
  //       getUserDetails(accessToken).then((response) => {
  //         const userData = {
  //           isLoggedIn: true,
  //           accessToken,
  //           userDetails: response.user
  //         }

  //         dispatch(updateUserDetails(userData));
  //       }).catch((err) => {
  //         console.log('error while fetching user details', err);
  //       })
  //     }
  //   })();
  // }, []);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? 'black' : 'white',
  };

  return (
    <>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
        {
          userDetails?.isLoggedIn ? null : 
          <NavigationContainer>
            <AuthStack />
          </NavigationContainer>
        }
    </>
  );
}
