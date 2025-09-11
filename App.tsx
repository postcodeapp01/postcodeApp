/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {StatusBar, useColorScheme} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import AuthStack from './navigators/stacks/AuthStack';
import {updateUserDetails} from './reduxSlices/UserSlice';
import {RootState} from './Store';
import {getUserDetails} from './app/auth/authServices/AuthServices';
import {getItemFromAsyncStorage} from './app/common/utils/asyncStorage/AsyncStorageUtils';
import MyDrawer from './navigators/DrawerNavigator';
import Loader from './app/common/utils/Loader';

export default function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const userDetails = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async function () {
      setIsLoading(true);
      try {
        const accessToken =
          (await getItemFromAsyncStorage('accessToken')) || '';
        if (accessToken) {
          getUserDetails(accessToken)
            .then(response => {
              const userData = {
                isLoggedIn: true,
                accessToken,
                userDetails: response.user,
              };

              dispatch(updateUserDetails(userData));
            })
            .catch(err => {
              console.log('error while fetching user details', err);
            });
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? 'black' : 'white',
  };

  return (
    <>
      {isLoading ? <Loader /> : null}
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />

      <NavigationContainer>
        {userDetails?.isLoggedIn ? <MyDrawer /> : <AuthStack />}
      </NavigationContainer>
    </>
  );
}
