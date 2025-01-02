/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Colors
} from 'react-native/Libraries/NewAppScreen';
import { connect } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './navigators/stacks/UserProfileStack';
import { IUserDetails } from './reduxSlices/UserSlice';

function App({ userDetails }: IUserDetails): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

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

function mapStateToProps({user}: any) {
  return {
    userDetails: user,
  }
}

export default connect(mapStateToProps, null)(App);
