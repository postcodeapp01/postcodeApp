import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export interface Store {
  id: string | number;
  name: string;
  logo?: string;
  rating?: number;
  reviewCount?: string;
  distance?: number;
  distanceKm?: string;
  distanceMeters?: number;
  location?: string;
  offer?: string;
  deliveryTime?: string;
  category?: string;
}

interface StoreCardProps {
  store: Store;
  onPress?: (store: Store) => void;
}

const StoreCard: React.FC<StoreCardProps> = ({store, onPress}) => {
  const formatDistance = () => {
    if (store.distanceKm) {
      return `${store.distanceKm} km`;
    }
    if (store.distanceMeters) {
      return store.distanceMeters < 1000 
        ? `${store.distanceMeters} m`
        : `${(store.distanceMeters / 1000).toFixed(2)} km`;
    }
    return store.distance || '1 km';
  };
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress?.(store)}
      activeOpacity={0.85}>
      
      {/* Store Image with Overlay */}
      <View style={styles.imageContainer}>
        <Image 
          source={store.logo ? {uri: store.logo} : require('../../../../sources/images/c1.png')} 
          style={styles.storeImage} 
        />
        
        {/* Offer Badge */}
        {store.offer && (
          <View style={styles.offerBadge}>
            <Text style={styles.offerText}>{store.offer.toUpperCase()}</Text>
          </View>
        )}
      </View>

      {/* Info Section */}
      <View style={styles.infoSection}>
        {/* Store Name */}
        <Text style={styles.storeName} numberOfLines={1}>
          {store.name}
        </Text>
        
        {/* Details Row */}
        <View style={styles.detailsRow}>
          {/* Delivery Time */}
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={16} color="#34A853" />
            <Text style={styles.detailText}>
              {store.deliveryTime || '45-50 Mins'}
            </Text>
          </View>
          <Text>|</Text>
          {/* Distance */}
          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={16} color="#34A853" />
            <Text style={styles.detailText}>{formatDistance()}</Text>
          </View>
        </View>

        {/* Rating */}
        <View style={styles.ratingRow}>
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={12} color="#FFD700" />
            <Text style={styles.ratingText}>
              {store.rating || '4.5'}
            </Text>
          </View>
          <Text style={styles.reviewText}>
            ({store.reviewCount || '2k+ ratings'})
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default StoreCard;

const styles = StyleSheet.create({
  card: {
    width: 180,
    height:220,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginLeft: 10,
   
  },
  imageContainer: {
    width: '100%',
    height: 140,
    position: 'relative',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden',
  },
  storeImage: {
    width: '100%',
    height: '100%',
    // backgroundColor: '#F0F0F0',
  },
  offerBadge: {
    position: 'absolute',
    // top: 8,
    right: 0,
    backgroundColor: '#306CFE',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomLeftRadius:10,
  },
  offerText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  infoSection: {
    padding: 10,
    paddingTop:5,
    backgroundColor: '#F1F1F1',
    borderBottomRightRadius:10,
    borderBottomLeftRadius:10

  },
  storeName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 5,
    lineHeight:20,
    letterSpacing:0.1,
  },
  category: {
    fontSize: 11,
    color: '#999',
    marginBottom: 6,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#636363',
    marginLeft: 3,
    lineHeight:20,
    letterSpacing:0.1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
    marginRight: 5,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#636363',
    marginLeft: 2,
  },
  reviewText: {
    fontSize: 12,
    color: '#636363',
    lineHeight:20,
    letterSpacing:0.1,
  },
});
