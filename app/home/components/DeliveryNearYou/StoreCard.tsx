import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export interface Store {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: string;
  distance: string;
  isOpen: boolean;
  deliveryTime: string;
  category?: string;
}

interface StoreCardProps {
  store: Store;
  onPress?: (store: Store) => void;
}

const StoreCard: React.FC<StoreCardProps> = ({store, onPress}) => {
  return (
    <TouchableOpacity
      style={styles.storeCard}
      onPress={() => onPress?.(store)}
      activeOpacity={0.9}>
      {/* Store Image */}
      <View style={styles.imageWrapper}>
        <Image source={{uri: store.image}} style={styles.storeImage} />

        {/* Status Badge */}
        <View
          style={[
            styles.statusBadge,
            store.isOpen ? styles.openBadge : styles.closedBadge,
          ]}>
          <Text style={styles.statusText}>
            {store.isOpen ? 'Open Now' : 'Closed'}
          </Text>
        </View>
      </View>

      {/* Info Section */}
      <View style={styles.infoSection}>
        <Text style={styles.storeName} numberOfLines={1}>
          {store.name}
        </Text>

        <View style={styles.detailsRow}>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={14} color="#FFD700" />
            <Text style={styles.rating}>{store.rating}</Text>
            <Text style={styles.reviewCount}>
              ({store.reviewCount} reviews)
            </Text>
          </View>
          <Text> |</Text>
          <View style={styles.locationContainer}>
            <Icon name="place" size={14} color="#222" />
            <Text style={styles.distance}>{store.distance}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default StoreCard;

const styles = StyleSheet.create({
  storeCard: {
    width: 200,
    height: 210,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  imageWrapper: {
    width: '100%',
    height: 140,
    position: 'relative',
  },
  storeImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  statusBadge: {
    position: 'absolute',
    // top: 8,
    // left: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 50,
  },
  openBadge: {backgroundColor: '#68A371'},
  closedBadge: {backgroundColor: '#999'},
  statusText: {
    fontSize: 8,
    fontWeight: '500',
    color: '#fff',
  },
  infoSection: {
    flex: 1,
    padding: 10,
  },
  storeName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    marginBottom: 3,
    letterSpacing:0.1,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingContainer: {flexDirection: 'row', alignItems: 'center'},
  rating: {fontSize: 13, fontWeight: '500', marginHorizontal: 4},
  reviewCount: {fontSize: 12, color: '#666'},
  locationContainer: {flexDirection: 'row', alignItems: 'center'},
  distance: {fontSize: 12, color: '#666', marginLeft: 4},
});
