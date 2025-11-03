// components/Store/StoreInfo.tsx
import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

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
}

const StoreInfo: React.FC<StoreInfoProps> = ({store}) => {
  // sane defaults
  const name = store?.name ?? 'Store';
  const address = store?.location ?? '';
  const rating = store?.rating ?? 4.3;
  const deliveryTime = store?.deliveryTime ?? '45-60 mins';
  const distance = store?.distance ?? '1.2 km';
  const ratingCount = store?.ratingCount ?? '1.2k+';

  return (
    <View style={styles.card}>
      {/* store image */}
      <View style={styles.imageWrapper}>
        <Image
          source={
            store?.logo
              ? {uri: store.logo}
              : require('../../../sources/images/max-store.png')
          }
          defaultSource={require('../../../sources/images/max-store.png')}
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
            <Text style={styles.address} numberOfLines={1}>
              {address}
            </Text>
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

          {/* small square rating box (green background with star and numeric) */}
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
