import React, {useEffect, useState} from 'react';
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
import {RootState} from '../../../../Store';

export const NearbyStores: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const [nearByStores, setNearByStores] = useState<any[]>([]);
  const {stores, loading} = useSelector((state: RootState) => state.storeData);
  useEffect(() => {
    if (stores.length > 0) {
      const filterNearbyStores = async () => {
        const granted = await requestLocationPermission();
        if (!granted) {
          Alert.alert(
            'Permission Denied',
            'Cannot fetch nearby stores without location access.',
          );
          return;
        }

        Geolocation.getCurrentPosition(
          position => {
            try {
              const {latitude, longitude} = position.coords;

              const nearbyStores = stores
                .map((store: any) => {
                  const distance = (
                    calculateDistance(store, latitude, longitude) / 1000
                  ).toFixed(2);
                  return {...store, distance};
                })
                .filter((store: any) => Number(store.distance) < 10);

              // console.log("✅ nearbyStores:", nearbyStores[0]);
              setNearByStores(nearbyStores);
            } catch (err) {
              console.error(err);
              Alert.alert('Error', 'Failed to filter nearby stores.');
            }
          },
          error => {
            console.error(error);
            Alert.alert('Location Error', 'Unable to get your location.');
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      };

      filterNearbyStores();
    }
  }, [stores]);

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#7A00E6" style={{marginTop: 20}} />
    );
  }

  if (nearByStores.length === 0) {
    return (
      <View style={styles.emptyContainer}>
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
        {nearByStores.map((store: any) => (
          <StoreCard
            key={store.id}
            store={{...(store || {}), logo: {uri: store.logo}}}
            onPress={() => {
              navigation.navigate('StoreScreen', {storeId: store.id});
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
};
export default NearbyStores;

const styles = StyleSheet.create({
  emptyContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  container: {
    height: 140,
    // backgroundColor: '#721515ff',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 12,
  },
  scrollView: {
    // paddingHorizontal: 8,
  },
  storesContainer: {
    // paddingHorizontal: 8,
  },
});
