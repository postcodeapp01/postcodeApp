import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const StoreInfo: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Store Image */}
      <Image
        source={require('../../../sources/images/max-store.png')} // Adjust path
        style={styles.storeImage}
        resizeMode="cover"
      />
      
      {/* Store Details */}
      <View style={styles.storeDetails}>
        <View style={styles.storeHeader}>
          <Text style={styles.storeName}>Max Fashion</Text>
          <TouchableOpacity style={styles.followButton}>
            <Text style={styles.followButtonText}>Follow</Text>
          </TouchableOpacity>
        </View>
        
        {/* Rating and Distance */}
        <View style={styles.storeStats}>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>4.2 (1.8k)</Text>
          </View>
          <View style={styles.separator} />
          <Text style={styles.distanceText}>1.2km away</Text>
        </View>
        
        {/* Description */}
        <Text style={styles.description}>
          Max fashions offers trendy and affordable clothing for men, women and kids. Latest fashion at best prices.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  storeImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#f5f5f5',
  },
  storeDetails: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  storeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  storeName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  followButton: {
    backgroundColor: '#00C851',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  followButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  storeStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  separator: {
    width: 1,
    height: 12,
    backgroundColor: '#ccc',
    marginHorizontal: 12,
  },
  distanceText: {
    fontSize: 14,
    color: '#666',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default StoreInfo;
