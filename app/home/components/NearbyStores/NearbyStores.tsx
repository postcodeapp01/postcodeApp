import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import StoreCard from './StoreCard';

import {calculateDistance} from '../../../common/utils/distanceCalculator';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../Store';

export const NearbyStores: React.FC = () => {
  const navigation = useNavigation<any>();
  const [nearByStores, setNearByStores] = useState<any[]>([]);
  const {stores, loading} = useSelector((state: RootState) => state.storeData);
  const userLocation=useSelector((state:RootState)=>state.user.userDetails.location);
  // console.log("locaion deatils",userLocation);
  useEffect(() => {
    if (stores.length > 0 && userLocation) {
      try {
        const { lat, lng } = userLocation;

        const nearbyStores = stores
          .map((store: any) => {
            const distance = (
              calculateDistance(
                parseFloat(store.latitude),
                parseFloat(store.longitude),
                lat,
                lng
              ) / 1000
            ).toFixed(2);
            return { ...store, distance };
          })
          .filter((store: any) => Number(store.distance) < 10);

        setNearByStores(nearbyStores);
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'Failed to filter nearby stores.');
      }
    }
  }, [stores, userLocation]);
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
