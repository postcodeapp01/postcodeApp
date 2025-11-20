
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LocationsModal from './LocationsModal';

interface StoreInfoProps {
  store: {
    id?: number | string;
    name?: string;
    logo?: string;
    location?: string;
    rating?: number | string;
    deliveryTime?: string;
    distance?: string;
    ratingCount?: string;
  };
  similarStores?: any[] | { similarStores?: any[] } | null;
  onLocationSelect?: (location: any) => void;
}

const toFriendlyKm = (meters?: number | string | null) => {
  if (meters == null) return '';
  const m = Number(meters);
  if (Number.isNaN(m)) return '';
  const km = m / 1000;
  return `${(Math.round(km * 100) / 100).toFixed(2)} km`;
};

const StoreInfo: React.FC<StoreInfoProps> = ({store, similarStores, onLocationSelect}) => {
  const name = store?.name ?? 'Store';
  const address = store?.location ?? '';
  const rating = store?.rating ?? 4.3;
  const deliveryTime = store?.deliveryTime ?? '45-60 mins';
  const distance = store?.distance ?? '1.2 km';
  const ratingCount = store?.ratingCount ?? '1.2k+';
  const [modalVisible, setModalVisible] = useState(false);

  const locationsArray = useMemo(() => {
    let raw: any[] = [];
    if (Array.isArray(similarStores)) {
      raw = similarStores;
    } else if (similarStores && Array.isArray(similarStores.similarStores)) {
      raw = similarStores.similarStores;
    } else {
      raw = [];
    }

    return raw.map((s: any) => {
      const distanceMeters = s.distance != null ? Number(s.distance) : null;
      const friendlyDistance = toFriendlyKm(distanceMeters);
      return {
        id: s.id,
        name: s.name ?? s.storeName ?? 'Store',
        address: s.location ?? s.address ?? '',
        rating: s.rating != null ? Number(s.rating) : undefined,
        ratingCount: s.reviews_count != null ? String(s.reviews_count) : undefined,
        deliveryTime: s.deliveryTime ?? undefined,
        distance: friendlyDistance || (s.distanceKm ? `${s.distanceKm} km` : ''),
        rawDistanceMeters: distanceMeters,
        logo: s.logo ?? s.image ?? undefined,
      };
    });
  }, [similarStores]);
  const allLocations = [
    {
      id: store?.id ?? 'current',
      name: name,
      address: address,
      rating: rating,
      ratingCount: ratingCount,
      deliveryTime: deliveryTime,
      distance:
      typeof distance === 'number'
      ? `${distance.toFixed(2)} km`
      : distance,
      isCurrent: true, 
    },
    ...(similarStores || []).map((s: any) => ({
      id: s.id,
      name: s.name,
      address: s.location,
      rating: s.rating ?? 4.2,
      ratingCount: '1k+',
      deliveryTime: '45-60 mins',
      distance:
      s.distance > 1000
      ? `${(s.distance / 1000).toFixed(2)} km`
      : `${s.distance.toFixed(0)} m`,
      isCurrent: false,
    })),
  ];
  return (
    <>
      <View style={styles.card}>
        {/* store image */}
        <View style={styles.imageWrapper}>
          <Image
            source={
              store?.logo
                ? {uri: store.logo}
                : require('../../../../sources/images/max-store.png')
            }
            defaultSource={require('../../../../sources/images/max-store.png')}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        {/* details area */}
        <View style={styles.details}>
          <View style={styles.row}>
            <View style={styles.nameBlock}>
              <Text style={styles.name} numberOfLines={1}>
                {name}
              </Text>
              <View style={styles.addressRow}>
                <Text style={styles.address} numberOfLines={1}>
                  {address}
                </Text>
                <TouchableOpacity
                  onPress={() => setModalVisible(true)}
                  hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
                >
                  <Icon name="chevron-down-sharp" size={17} color="#000" />
                </TouchableOpacity>
              </View>
              <View style={styles.chipsRow}>
                <View style={styles.chip}>
                  <Icon name="time-outline" size={17} color="#34A853" />
                  <Text style={styles.chipText}>{deliveryTime}</Text>
                </View>
                <Text>|</Text>
                <View style={styles.chip}>
                  <Icon name="location-outline" size={17} color="#34A853" />
                  <Text style={styles.chipText}>{distance}</Text>
                </View>
              </View>
            </View>

            {/* small square rating box */}
            <View style={styles.smallRating}>
              <View style={styles.smallRatingText2}>
                <Icon name="star" size={14} color="#F4B400" />
                <Text style={styles.smallRatingText}> {String(rating)}</Text>
              </View>

              <View style={styles.ratingsBadge}>
                <Text style={styles.ratingsBadgeText}>{ratingCount} ratings</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Locations Modal */}
      <LocationsModal
        visible={modalVisible}
        locations={allLocations}
        onClose={() => setModalVisible(false)}
        onSelectLocation={(location) => {
          if (onLocationSelect) {
            onLocationSelect(location);
          }
        }}
        currentLocationId={store?.id}
        initialLocationsToShow={4}
      />
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    height:229,
    shadowColor: '#000',
    shadowOpacity: 0.8,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 8,

    elevation: 3,

    // overflow: 'hidden',
  },
  imageWrapper: {
    width: '100%',
    height: 130,
    backgroundColor: '#eee',
  },
  image: {
    width: '100%',
    height: '100%',
  },

  details: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  nameBlock: {
    flex: 1,
  },

  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
    lineHeight: 25,
    letterSpacing: 0.1,
  },
  addressRow:{
    flexDirection: 'row',
    alignItems: 'center',
  },
  address: {
    fontSize: 14,
    color: '#636363',
    fontWeight: '500',
    lineHeight: 20,
    letterSpacing: 0.1,
    paddingVertical: 5,
    paddingHorizontal: 3,
  },

  smallRating: {
    flexDirection: 'column',
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallRatingText2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#34A853',
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 5,
    gap: 5,
  },
  smallRatingText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  chipsRow: {
    // marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
  },
  chipText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#636363',
    fontWeight: '600',
    lineHeight: 20,
    letterSpacing: 0.1,
  },

  ratingsBadge: {
    marginLeft: 'auto',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  ratingsBadgeText: {
    fontSize: 12,
    color: '#636363',
    fontWeight: '500',
    lineHeight: 20,
    letterSpacing: 0.1,
  },
});

export default StoreInfo;
