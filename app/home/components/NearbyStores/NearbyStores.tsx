// import React, {useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   ActivityIndicator,
//   Alert,
// } from 'react-native';
// import Geolocation from 'react-native-geolocation-service';
// import StoreCard from './StoreCard';
// import {requestLocationPermission} from '../../../common/permissions/location';
// import {calculateDistance} from '../../../common/utils/distanceCalculator';
// import {useNavigation} from '@react-navigation/native';
// import {useDispatch, useSelector} from 'react-redux';
// import {RootState} from '../../../../Store';
// import {setStores} from '../../../../reduxSlices/storeSlice';
// import { domainUrl } from '../../../../config/Api';



// export const NearbyStores: React.FC = () => {
//   const dispatch = useDispatch();
//   const navigation = useNavigation<any>();

//   const stores = useSelector((state: RootState) => state.storeData.stores);
//   const [loading, setLoading] = useState(stores.length === 0);

//   useEffect(() => {
//     if (stores.length > 0) {
//       // ✅ Already fetched
//       setLoading(false);
//       return;
//     }

//     const fetchNearbyStores = async () => {
//       const granted = await requestLocationPermission();
//       if (!granted) {
//         Alert.alert(
//           'Permission Denied',
//           'Cannot fetch nearby stores without location access.',
//         );
//         setLoading(false);
//         return;
//       }

//       Geolocation.getCurrentPosition(
//         async position => {
//           try {
//             const {latitude, longitude} = position.coords;

//             const res = await fetch(`${domainUrl}/stores`);
//             const data = await res.json();

//             const nearbyStores = data
//               .map((store: any) => {
//                 const distance = (
//                   calculateDistance(store, latitude, longitude) / 1000
//                 ).toFixed(2);
//                 return {...store, distance};
//               })
//               .filter((store:any) => Number(store.distance) < 10);

//             dispatch(setStores(nearbyStores));
//           } catch (err) {
//             console.error(err);
//             Alert.alert('Error', 'Failed to fetch nearby stores.');
//           } finally {
//             setLoading(false);
//           }
//         },
//         error => {
//           console.error(error);
//           Alert.alert('Location Error', 'Unable to get your location.');
//           setLoading(false);
//         },
//         {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
//       );
//     };

//     fetchNearbyStores();
//   }, [stores, dispatch]);

//   if (loading) {
//     return (
//       <ActivityIndicator size="large" color="#7A00E6" style={{marginTop: 20}} />
//     );
//   }

//   if (stores.length === 0) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.title}>Nearby Stores</Text>
//         <Text style={{textAlign: 'center', color: '#555'}}>
//           No stores found within 10 km.
//         </Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Nearby Stores</Text>
//       <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//         {stores.map(store => (
//           <StoreCard
//             key={store.id}
//             store={{...store, logo: {uri: store.logo}}}
//             onPress={() => navigation.navigate('StoreScreen')}
//           />
//         ))}
//       </ScrollView>
//     </View>
//   );
// };
import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import StoreCard from './StoreCard';
import {requestLocationPermission} from '../../../common/permissions/location';
import {calculateDistance} from '../../../common/utils/distanceCalculator';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState, store} from '../../../../Store';
// import {setStores, setLoading} from '../../../../reduxSlices/storeSlice';

export const NearbyStores: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();

  const {stores, loading} = useSelector((state: RootState) => state.storeData);
  // console.log(".........",stores[0]);
  useEffect(() => {
    if (stores.length === 0) {
      const filterNearbyStores = async () => {
        // dispatch(setLoading(true));

        const granted = await requestLocationPermission();
        if (!granted) {
          Alert.alert(
            'Permission Denied',
            'Cannot fetch nearby stores without location access.',
          );
          // dispatch(setLoading(false));
          return;
        }

        Geolocation.getCurrentPosition(
          position => {
            try {
              const {latitude, longitude} = position.coords;

              // ✅ Filter existing stores from Redux
              const nearbyStores = stores
                .map((store: any) => {
                  const distance = (
                    calculateDistance(store, latitude, longitude) / 1000
                  ).toFixed(2);
                  return {...store, distance};
                })
                .filter((store: any) => Number(store.distance) < 10);

              // dispatch(setStores(nearbyStores));
            } catch (err) {
              console.error(err);
              Alert.alert('Error', 'Failed to filter nearby stores.');
            } finally {
              // dispatch(setLoading(false));
            }
          },
          error => {
            console.error(error);
            Alert.alert('Location Error', 'Unable to get your location.');
            // dispatch(setLoading(false));
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      };

      filterNearbyStores();
    }
  }, [stores, dispatch]);

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#7A00E6" style={{marginTop: 20}} />
    );
  }

  if (stores.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Nearby Stores</Text>
        <Text style={{textAlign: 'center', color: '#555'}}>
          No stores found within 10 km.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nearby Stores</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {stores.map(store => (
          <StoreCard
            key={store.id}
            store={{...store, logo: {uri: store.logo}}}
            onPress={() =>
              navigation.navigate('StoreScreen', {storeId: store.id})
            }
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    marginVertical: 12,

    paddingVertical: 20,
    backgroundColor: ' #FFFFFF', // Linear gradient from white to light purple
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 16,
    // paddingHorizontal: 16,
    left: 8,
  },
  scrollView: {
    paddingHorizontal: 8,
  },
  storesContainer: {
    paddingHorizontal: 8,
  },
});

export default NearbyStores;
