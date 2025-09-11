import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

type Order = {
  id: string;
  productName: string;
  brand: string;
  imageUrl: string;
  currentPrice: number;
  originalPrice: number;
  discount: number;
  size: string;
  orderDate: string;
  status: 'delivered' | 'shipped' | 'processing' | 'cancelled';
  trackingStatus: string;
  productRating: number;
  deliveryRating: number;
  hasReordered: boolean;
};

type Props = {
  order: Order;
  onTrackOrder: () => void;
  onReorder: () => void;
  onRateOrder: () => void;
};

const OrderCard: React.FC<Props> = ({ order, onTrackOrder, onReorder, onRateOrder }) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Icon
        key={i}
        name="star"
        size={16}
        color={i < rating ? '#FFD700' : '#E0E0E0'}
      />
    ));
  };

  return (
    <View style={styles.container}>
      {/* Product Info */}
      <View style={styles.productSection}>
        <Image source={{ uri: order.imageUrl }} style={styles.productImage} />
        
        <View style={styles.productDetails}>
          <Text style={styles.brandName}>{order.brand}</Text>
          <Text style={styles.productName} numberOfLines={2}>
            {order.productName}
          </Text>
          
          <View style={styles.priceRow}>
            <Text style={styles.currentPrice}>₹ {order.currentPrice}</Text>
            <Text style={styles.originalPrice}>₹{order.originalPrice}</Text>
            <Text style={styles.discount}>{order.discount}% OFF</Text>
          </View>
          
          <View style={styles.orderInfo}>
            <Text style={styles.sizeText}>Size: {order.size}</Text>
          </View>
        </View>
      </View>

      {/* Track Order Button */}
      <TouchableOpacity style={styles.trackButton} onPress={onTrackOrder}>
        <Text style={styles.trackButtonText}>TRACK YOUR ORDER </Text>
      </TouchableOpacity>

      {/* Order Status */}
      <View style={styles.statusSection}>
        <View style={styles.statusLeft}>
          <Text style={styles.orderDate}>Order placed on {order.orderDate}</Text>
          <Text style={styles.statusText}>{order.trackingStatus}</Text>
        </View>
        <Text style={styles.priceText}>₹ {order.currentPrice}</Text>
      </View>

      {/* Ratings */}
      <View style={styles.ratingsSection}>
        <View style={styles.ratingItem}>
          <Text style={styles.ratingLabel}>Product Rating</Text>
          <View style={styles.starsRow}>
            {renderStars(order.productRating)}
          </View>
        </View>
        
        <View style={styles.ratingItem}>
          <Text style={styles.ratingLabel}>Delivery Rating</Text>
          <View style={styles.starsRow}>
            {renderStars(order.deliveryRating)}
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <TouchableOpacity style={styles.reorderButton} onPress={onReorder}>
        <Text style={styles.reorderButtonText}>REORDER </Text>
      </TouchableOpacity>
    </View>
  );
};

export default OrderCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  // Product Section
  productSection: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  productImage: {
    width: 80,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#F8F8F8',
    marginRight: 12,
  },
  productDetails: {
    flex: 1,
  },
  brandName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF3366',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  productName: {
    fontSize: 14,
    color: '#282C3F',
    marginBottom: 8,
    lineHeight: 18,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#282C3F',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 12,
    color: '#94969F',
    textDecorationLine: 'line-through',
    marginRight: 6,
  },
  discount: {
    fontSize: 12,
    color: '#FF3366',
    fontWeight: '600',
  },
  orderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sizeText: {
    fontSize: 12,
    color: '#666666',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },

  // Track Button
  trackButton: {
    backgroundColor: '#FF3366',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  trackButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  // Status Section
  statusSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    marginBottom: 16,
  },
  statusLeft: {
    flex: 1,
  },
  orderDate: {
    fontSize: 12,
    color: '#94969F',
    marginBottom: 4,
  },
  statusText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#282C3F',
  },

  // Ratings Section
  ratingsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  ratingItem: {
    flex: 1,
  },
  ratingLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  starsRow: {
    flexDirection: 'row',
  },

  // Reorder Button
  reorderButton: {
    backgroundColor: '#FF3366',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  reorderButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});