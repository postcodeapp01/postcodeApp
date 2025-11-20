
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  GestureResponderEvent,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axiosInstance from '../../../config/Api';
import { useNavigation } from '@react-navigation/native';

interface Store {
  id: string | number;
  name: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  deliveryTime?: string;
  distance?: string | number;
}

interface Product {
  id: string | number;
  name: string;
  image: string | null;
  price: string | number;
  originalPrice?: string | number;
  discount?: string;
  brand: string;
  rating?: number;
  store?: Store;
}

interface ProductCardProps {
  product: Product;
  horizontal?: boolean;
  isFavorite?: boolean;
  horizontalCardWidth?: number;
  onPress?: (event: GestureResponderEvent) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  horizontal = false,
  onPress,
  isFavorite = false,
  horizontalCardWidth = 160,
}) => {
  const navigation = useNavigation();
  const [isWishlisted, setIsWishlisted] = useState(false);

 
  const VERTICAL_CONTAINER_PADDING = 15; // Left/right padding of the container
  const VERTICAL_COLUMN_GAP = 9; // Gap between two columns
  const HORIZONTAL_CARD_GAP = 5; // Gap between horizontal cards


  const getCardWidth = () => {
    if (horizontal) {
      return horizontalCardWidth;
    }
    const availableWidth = SCREEN_WIDTH - (VERTICAL_CONTAINER_PADDING * 2) - VERTICAL_COLUMN_GAP;
    return Math.floor(availableWidth / 2);
  };

  const cardWidth = getCardWidth();

  const priceNum = Number(product.price) || 0;
  const originalNum = product.originalPrice ? Number(product.originalPrice) : 0;
  const discountNum = product.discount ? Number(product.discount) : 0;

  const handleWishlistToggle = async () => {
    try {
      if (isWishlisted) {
        await axiosInstance.delete(`/wishlist/${product.id}`);
        setIsWishlisted(false);
      } else {
        await axiosInstance.post(`/wishlist/`, {
          productId: product.id,
        });
        Alert.alert('Added to wishlist!');
        setIsWishlisted(true);
      }
    } catch (error) {
      console.error('Wishlist toggle error', error);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { width: cardWidth },
        horizontal && { marginRight: HORIZONTAL_CARD_GAP },
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* Product Image */}
      <View style={styles.imageHolder}>
        <Image
          source={
            product.image
              ? { uri: product.image }
              : require('../../../sources/images/c1.png')
          }
          style={styles.productImage}
          resizeMode="cover"
        />

        {/* Favorite Button */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleWishlistToggle}
          activeOpacity={0.8}
        >
          <Icon
            name={isWishlisted ? 'heart' : 'heart-outline'}
            size={22}
            color="#B1B1B1"
          />
        </TouchableOpacity>
      </View>

      {/* Store Badge */}
      {product.store && (
        <View style={styles.storeBadge}>
          <Text style={styles.storeName} numberOfLines={1}>
            {product.store.name}
          </Text>

          <View style={styles.storeMetaRow}>
            <View style={styles.metaItem}>
              <Icon name="time-outline" size={10} color="#636363" />
              <Text style={styles.metaText}>
                {product.store.deliveryTime || '45-50 Mins'}
              </Text>
            </View>

            <View style={styles.metaDivider} />

            <View style={styles.metaItem}>
              <Icon name="location-outline" size={10} color="#636363" />
              <Text style={styles.metaText}>
                {product.store.distance || '1.2 km'}
              </Text>
            </View>
          </View>

          <Text style={styles.storeLocation} numberOfLines={1}>
            {product.store.location || 'Store location'}
          </Text>
        </View>
      )}

      {/* Product Info */}
      <View style={styles.productInfo}>
        <Text style={styles.brand} numberOfLines={1}>
          {product.brand}
        </Text>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>

        {/* Price Row */}
        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{priceNum.toLocaleString()}</Text>

          {originalNum > priceNum && (
            <Text style={styles.originalPrice}>
              ₹{originalNum.toLocaleString()}
            </Text>
          )}

          {discountNum > 0 && (
            <Text style={styles.discountText}>{discountNum}% OFF</Text>
          )}
        </View>

        {/* Rating */}
        <View style={styles.ratingContainer}>
          <Icon name="star" size={12} color="#F4B400" />
          <Text style={styles.ratingText}>
            {product.rating || 4.5} (2k+ ratings)
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    // marginBottom: 16,
    
  },

  imageHolder: {
    width: '100%',
    height: 200,
    backgroundColor: '#F5F5F5',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 35,
    height: 35,
    backgroundColor: '#fff',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },

  storeBadge: {
    width: '100%',
    height:58,
    backgroundColor: '#DDCF82',
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 2,
  },
  storeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222222',
    lineHeight: 15,
    letterSpacing: 0.1,
  },
  storeMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metaDivider: {
    width: 1,
    height: 10,
    backgroundColor: '#636363',
    opacity: 0.3,
  },
  metaText: {
    fontSize: 10,
    fontWeight: '500',
    lineHeight: 14,
    color: '#636363',
    letterSpacing: 0.1,
  },
  storeLocation: {
    fontSize: 10,
    fontWeight: '500',
    color: '#222222',
    lineHeight: 15,
    letterSpacing: 0.1,
  },

  productInfo: {
    padding:10,
    gap: 4,
    // backgroundColor: '#d88787ff',
  },
  brand: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222222',
    lineHeight: 15,
    letterSpacing: -0.32,
  },
  productName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#636363',
    lineHeight: 15,
    letterSpacing: 0.1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 3,
  },
  price: {
    fontSize: 12,
    fontWeight: '600',
    color: '#222',
    lineHeight: 15,
    letterSpacing: 0.1,
  },
  originalPrice: {
    fontSize: 12,
    color: '#636363',
    textDecorationLine: 'line-through',
    lineHeight: 15,
    letterSpacing: 0.1,
    fontWeight: '600',
  },
  discountText: {
    fontSize: 10,
    color: '#FF5964',
    fontWeight: '700',
    lineHeight: 15,
    letterSpacing: 0.1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#636363',
    letterSpacing: 0.1,
    lineHeight: 15,
  },
});
