// import React, {useEffect, useState} from 'react';
// import {StatusBar, useColorScheme} from 'react-native';
// import {useSelector, useDispatch} from 'react-redux';
// import {NavigationContainer} from '@react-navigation/native';
// import AuthStack from './navigators/stacks/AuthStack';
// import {updateUserDetails} from './reduxSlices/UserSlice';
// import {AppDispatch, RootState} from './Store';
// import {getUserDetails} from './app/auth/authServices/AuthServices';
// import {getItemFromAsyncStorage} from './app/common/utils/asyncStorage/AsyncStorageUtils';
// import MyDrawer from './navigators/DrawerNavigator';
// import Loader from './app/common/utils/Loader';
// import {fetchStores} from './reduxSlices/storeSlice';
// import {fetchCategories} from './reduxSlices/categorySlice';
// import {fetchAddresses} from './reduxSlices/addressesSlice';

// const linking = {
//   prefixes: ['trendrush://'],
//   config: {
//     screens: {
//       Home: {
//         screens: {
//           Home: 'home',
//           ProductDetails: 'product/:id',
//         },
//       },
//     },
//   },
// };

// export default function App(): React.JSX.Element {
//   const isDarkMode = useColorScheme() === 'dark';
//   const userDetails = useSelector((state: RootState) => state.user);
//   const [isLoading, setIsLoading] = useState(true);
//   const [initialUrl, setInitialUrl] = useState<string | null>(null);
//   const dispatch = useDispatch<AppDispatch>();
//   useEffect(() => {
//     (async function () {
//       setIsLoading(true);
//       try {
//         const accessToken =
//           (await getItemFromAsyncStorage('accessToken')) || '';
//         if (accessToken) {
//           getUserDetails(accessToken)
//             .then(response => {
//               // console.log("respomse",response)
//               const userData = {
//                 isLoggedIn: true,
//                 accessToken,
//                 userDetails: response.data,
//               };
//               // console.log("in appp",userData.userDetails);
//               dispatch(updateUserDetails(userData));
//             })
//             .catch(err => {
//               console.log('error while fetching user details', err);
//             });
//         }
//       } catch (err) {
//         console.log(err);
//       } finally {
//         setIsLoading(false);
//       }
//     })();
//   }, []);
//   useEffect(() => {
//     dispatch(fetchStores());
//     dispatch(fetchCategories());
//     dispatch(fetchAddresses());
//   }, [dispatch]);
//   const backgroundStyle = {
//     backgroundColor: isDarkMode ? 'black' : 'white',
//   };

//   return (
//     <>
//       {isLoading ? <Loader /> : null}
//       <StatusBar
//         barStyle={isDarkMode ? 'light-content' : 'dark-content'}
//         backgroundColor={backgroundStyle.backgroundColor}
//       />
//       {!isLoading && (
//         <NavigationContainer
//           linking={{
//             ...linking,
            
//             getInitialState: async () => {
//               if (!userDetails?.isLoggedIn) return undefined;
//               const url = await import('react-native').then(mod =>
//                 mod.Linking.getInitialURL(),
//               );
//               if (url) {
//                 setInitialUrl(url);
//                 return getStateFromPath(url, linking.config);
//               }
//               return undefined;
//             },
//           }}>
//           {userDetails?.isLoggedIn ? <MyDrawer /> : <AuthStack />}
//         </NavigationContainer>
//       )}
//     </>
//   );
// }



// App.tsx
// App.tsx (replace your existing file)
// App.tsx - fixed deep link parsing + fallback
import React, { useEffect } from 'react';
import { StatusBar, useColorScheme, Linking } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { AppDispatch, RootState } from './Store';
import MyDrawer from './navigators/DrawerNavigator';
import AuthStack from './navigators/stacks/AuthStack';
import Loader from './app/common/utils/Loader';
import { fetchStores } from './reduxSlices/storeSlice';
import { fetchCategories } from './reduxSlices/categorySlice';
import { fetchAddresses } from './reduxSlices/addressesSlice';
import useAppBootstrap from './app/common/hooks/useAppBootstrap';


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
  const { isBootstrapping, initialNavState, pendingUrl, setPendingUrl } = useAppBootstrap(linkingConfig);

  useEffect(() => {
    dispatch(fetchStores());
    dispatch(fetchCategories());
    dispatch(fetchAddresses());
  }, [dispatch]);

  useEffect(() => {
    if (!pendingUrl || !navigationRef.isReady() || !userDetails?.isLoggedIn) return;
    const match = pendingUrl.match(/product\/([^/?#]+)/i);
    if (match && match[1]) {
      navigationRef.navigate('Home' as never, {
        screen: 'HomeTab',
        params: { screen: 'ProductDetails', params: { id: match[1] } },
      } as never);
    }
    setPendingUrl(null);
  }, [pendingUrl, userDetails?.isLoggedIn, navigationRef, setPendingUrl]);

  useEffect(() => {
    const handleUrlEvent = ({ url }: { url: string }) => setPendingUrl(url);
    const sub = Linking.addEventListener('url', handleUrlEvent);
    return () => sub.remove();
  }, [setPendingUrl]);

  const backgroundStyle = { backgroundColor: isDarkMode ? 'black' : 'white' };

  return (
    <>
      {isBootstrapping && <Loader />}
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={backgroundStyle.backgroundColor} />
      {!isBootstrapping && (
        <NavigationContainer ref={navigationRef} linking={linkingConfig} initialState={initialNavState}>
          {userDetails?.isLoggedIn ? <MyDrawer /> : <AuthStack />}
        </NavigationContainer>
      )}
    </>
  );
}



