import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export interface StoreRecommendation {
  id: string;
  name: string;
  category: string;
  image: string;
  distance: string;
  deliveryTime: string;
  rating: number;
  reviewCount: string;
  discount?: string;
}

interface Props {
  store: StoreRecommendation;
  onPress: () => void;
}

const StoreRecommendationCard: React.FC<Props> = ({store, onPress}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      {/* Store Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{uri: store.image}}
          style={styles.storeImage}
          resizeMode="cover"
        />

        {/* Discount Badge */}
        {store.discount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{store.discount}</Text>
          </View>
        )}
      </View>

      {/* Store Info */}
      <View style={styles.infoContainer}>
        {/* Header row: left = name+category, right = rating */}
        <View style={styles.headerRow}>
          <View style={styles.leftColumn}>
            <Text style={styles.storeName} numberOfLines={1}>
              {store.name}
            </Text>
            <Text style={styles.category} numberOfLines={1}>
              {' '}
              ({store.category})
            </Text>
          </View>

          {/* Rating on right */}
          <View style={styles.ratingRow}>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.ratingText}>{store.rating} ({store.reviewCount})</Text>
            </View>
          </View>
        </View>

        {/* Delivery Info Row */}
        <View style={styles.deliveryRow}>
          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={16} color="#34A853" />
            <Text style={styles.infoText}>{store.deliveryTime}</Text>
          </View>

          <View style={styles.separator}>
            <Text style={styles.separatorText}>|</Text>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="location-outline" size={16} color="#34A853" />
            <Text style={styles.infoText}>{store.distance}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: 220,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  imageContainer: {
    width: '100%',
    height: 160,
    position: 'relative',
    backgroundColor: '#F5F5F5',
  },
  storeImage: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#4A90E2',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  discountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
    textTransform: 'uppercase',
  },
  infoContainer: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    height: 60,
    backgroundColor:'#F1F1F1'
  },
  headerRow: {
    flexDirection: 'row',
  },
  leftColumn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  category: {
    top: -2,
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
    lineHeight: 20,
    letterSpacing: 0.1,
  },

  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    color: '#636363',
    marginLeft: 4,
    lineHeight:20,
    letterSpacing:0.1,
  },
  separator: {
    marginHorizontal: 3,
  },
  separatorText: {
    fontSize: 15,
    color:'#636363',
  },

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    borderRadius: 4,
    marginRight: 6,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#636363',
    marginLeft: 3,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  
});

export default StoreRecommendationCard;
