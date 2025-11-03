import React, {useEffect} from 'react';
import {StatusBar, useColorScheme, Linking} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import {AppDispatch, RootState} from './Store';
import MyDrawer from './navigators/DrawerNavigator';
import AuthStack from './navigators/stacks/AuthStack';
import Loader from './app/common/utils/Loader';
import {fetchStores} from './reduxSlices/storeSlice';
import {fetchCategories} from './reduxSlices/categorySlice';
import {fetchAddresses} from './reduxSlices/addressesSlice';
import useAppBootstrap from './app/common/hooks/useAppBootstrap';
import { fetchCart } from './reduxSlices/cartSlice';
import { fetchBookmarks } from './reduxSlices/bookmarkSlice';

const linkingConfig = {
  prefixes: ['trendrush://'],
  config: {
    screens: {
      Home: {
        screens: {
          HomeTab: {
            screens: {
              ProductDetails: 'product/:id',
            },
          },
        },
      },
    },
  },
};

export default function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const userDetails = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const navigationRef = useNavigationContainerRef();
  const {isBootstrapping, initialNavState, pendingUrl, setPendingUrl} =
    useAppBootstrap(linkingConfig);

  useEffect(() => {
    dispatch(fetchStores());
    dispatch(fetchCategories());
    dispatch(fetchAddresses());
    dispatch(fetchCart());
    dispatch(fetchBookmarks())
  }, [dispatch]);

  useEffect(() => {
    if (!pendingUrl || !navigationRef.isReady() || !userDetails?.isLoggedIn)
      return;
    const match = pendingUrl.match(/product\/([^/?#]+)/i);
    if (match && match[1]) {
      navigationRef.navigate(
        'Home' as never,
        {
          screen: 'HomeTab',
          params: {screen: 'ProductDetails', params: {id: match[1]}},
        } as never,
      );
    }
    setPendingUrl(null);
  }, [pendingUrl, userDetails?.isLoggedIn, navigationRef, setPendingUrl]);

  useEffect(() => {
    const handleUrlEvent = ({url}: {url: string}) => setPendingUrl(url);
    const sub = Linking.addEventListener('url', handleUrlEvent);
    return () => sub.remove();
  }, [setPendingUrl]);

  const backgroundStyle = {backgroundColor: isDarkMode ? 'black' : 'white'};

  return (
    <>
      {isBootstrapping && <Loader />}
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      {!isBootstrapping && (
        <NavigationContainer
          ref={navigationRef}
          linking={linkingConfig}
          initialState={initialNavState}>
          {userDetails?.isLoggedIn ? <MyDrawer /> : <AuthStack />}
        </NavigationContainer>
      )}
    </>
  );
}
