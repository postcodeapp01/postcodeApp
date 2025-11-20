import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import axiosInstance from '../../../../config/Api';
import StoreCard from './StoreCard';
import Icon from 'react-native-vector-icons/Ionicons';
interface NearbyStoresProps {
  distance?: number; // km
  title?: string;
  latitude: number;
  longitude: number;
  viewMoreScreen?: string;
  onViewMore?: (params?: {
    latitude: number;
    longitude: number;
    distance?: number;
  }) => void;
  previewLimit?: number;
}

export const NearbyStores: React.FC<NearbyStoresProps> = ({
  distance = 10,
  title = '',
  latitude,
  longitude,
  viewMoreScreen = 'NearbyStoresList',
  onViewMore,
  previewLimit = 2,
}) => {
  const navigation = useNavigation<any>();
  const [nearByStores, setNearByStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (latitude == null || longitude == null) {
      console.log('Waiting for location...');
      return;
    }

    let cancelled = false;

    const fetchNearbyStores = async () => {
      try {
        setLoading(true);
        const radius = distance * 1000;
        const response = await axiosInstance.get('/stores/nearby', {
          params: {
            latitude,
            longitude,
            radius,
          },
        });

        if (cancelled) return;

        if (response.data && Array.isArray(response.data.nearbyStores)) {
          const nearbyStores = response.data.nearbyStores.map((store: any) => {
            const distanceMeters = Math.round(store.distance ?? 0);
            const distanceKm = (distanceMeters / 1000).toFixed(2);
            return {
              ...store,
              distanceMeters,
              distanceKm,
            };
          });
          setNearByStores(nearbyStores);
        } else {
          setNearByStores([]);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) Alert.alert('Error', 'Failed to fetch nearby stores.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchNearbyStores();

    return () => {
      cancelled = true;
    };
  }, [latitude, longitude, distance]);

  // memoize visible list
  const visibleStores = useMemo(
    () => nearByStores.slice(0, previewLimit),
    [nearByStores, previewLimit],
  );
  const hasMore = useMemo(
    () => nearByStores.length > previewLimit,
    [nearByStores, previewLimit],
  );

  const handlePressStore = useCallback(
    (store: any) => {
      if (!store || !store.id) return;
      navigation.navigate('StoreScreen', {storeId: store.id});
    },
    [navigation],
  );

  const handleViewMore = useCallback(() => {
  if (typeof onViewMore === 'function') {
    onViewMore({ latitude, longitude, distance });
    return;
  }
  navigation.navigate('ViewMoreScreen', {
    latitude,
    longitude,
    distance,
    previewLimit,
    stores: nearByStores,
  });

}, [navigation, onViewMore, viewMoreScreen, latitude, longitude, distance, nearByStores]);

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#7A00E6" style={{marginTop: 20}} />
    );
  }

  if (!nearByStores || nearByStores.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={{textAlign: 'center', color: '#555'}}>
          No stores found within {distance} km.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {title ? <Text style={styles.title}>{title}</Text> : null}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {visibleStores.map((store: any) => {
          if (!store || !store.id) return null;
          // transform store shape for StoreCard - match your StoreCard expectations
          const cardStore = {
            ...(store || {}),
            logo: store.logo ? store.logo : undefined, // StoreCard accepts uri or require; your StoreCard handles that
            friendlyDistance:
              store.distanceMeters < 1000
                ? `${store.distanceMeters} m`
                : `${store.distanceKm} km`,
          };

          return (
            <StoreCard
              key={String(store.id)}
              store={cardStore}
              onPress={() => handlePressStore(store)}
            />
          );
        })}

        {/* if more than previewLimit, show view more card */}
        {hasMore && (
          <TouchableOpacity
            style={styles.viewMoreCard}
            onPress={handleViewMore}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="View more nearby stores">
            <Icon
              name="add-circle-outline" 
              size={56}
              color="#AAA"
              style={styles.viewMoreIcon}
            />
            <Text style={styles.viewMoreTitle}>View more</Text>
            <Text style={styles.viewMoreSubtitle}>
              {nearByStores.length - previewLimit} more
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

export default NearbyStores;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  scrollContent: {
    // paddingHorizontal: 12,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    paddingHorizontal: 12,
    color: '#222',
    lineHeight: 20,
  },
  emptyContainer: {padding: 16},
  viewMoreIcon: {
  marginBottom: 6,
},
  viewMoreCard: {
    width: 160,
    height: 215, // match approximate StoreCard height
    marginLeft: 12,
    marginRight: 6,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  viewMoreTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  viewMoreSubtitle: {
    fontSize: 13,
    color: '#666',
  },
});
