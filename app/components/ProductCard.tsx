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
import axiosInstance from '../../config/Api';

interface Store {
  id: string | number;
  name: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  deliveryTime?: string; // e.g., "45-50 Mins"
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
  onPress?: (e: GestureResponderEvent) => void;
  isFavorite?: boolean;
  horizontalCardWidth?: number;
}

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  horizontal = false,
  onPress = () => {},
  isFavorite = false,
  horizontalCardWidth = 180,
}) => {
  const outerPadding = 12 * 2;
  const gapBetweenCards = 12;
  const twoColumnWidth = Math.floor(
    (SCREEN_WIDTH - outerPadding - gapBetweenCards) / 2,
  );

  const cardWidth = horizontal ? horizontalCardWidth : twoColumnWidth;

  const priceNum = Number(product.price) || 0;
  const originalNum = product.originalPrice ? Number(product.originalPrice) : 0;
  const discountNum = product.discount ? Number(product.discount) : 0;
  const [isWishlisted, setIsWishlisted] = useState
  (false);
  const handleWishlistToggle = async () => {
    try {
      if (isWishlisted) {
        // remove
        await axiosInstance.delete(`/wishlist/${product.id}`);
        setIsWishlisted(false);
      } else {
        // add
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
  console.log("Productead",product)
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {width: cardWidth},
        horizontal && {marginRight: 14},
      ]}
      onPress={onPress}
      activeOpacity={0.85}>
      {/* Product Image */}
      <View style={styles.imageHolder}>
        <Image
          source={
            product.image
              ? {uri: product.image}
              : require('../../sources/images/c1.png')
          }
          style={styles.productImage}
          resizeMode="cover"
        />

        {/* Favorite Button */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleWishlistToggle}
          activeOpacity={0.8}>
          <Icon
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={20}
            color="#FF6B6B"
          />
        </TouchableOpacity>
      </View>

      {product.store && (
        <View style={styles.storeBadge}>
          {/* Store Name Row */}
          <Text style={styles.storeName} numberOfLines={1}>
            {product.store.name}
          </Text>

          {/* Time & Distance Row */}
          {/* {(product.store.deliveryTime || product.store.distance) && ( */}
          <View style={styles.storeMetaRow}>
            {/* {product.store.deliveryTime && ( */}
            <View style={styles.metaItem}>
              <Text style={styles.metaText}>45-50 Mins</Text>
            </View>
            {/* )} */}

            {/* {product.store.distance && ( */}
            <View style={styles.metaItem}>
              <Text style={styles.metaText}>1.2 km</Text>
            </View>
            {/* )} */}
          </View>
          {/* )} */}
          {/* Location Row */}
          <Text style={styles.storeLocation} numberOfLines={1}>
            {product.store.location}
          </Text>
        </View>
      )}
      <View style={styles.productInfo}>
        {/* Product Info */}
        {/* Brand & Product Name */}
        <Text style={styles.brand}>{product.brand}</Text>
        <Text style={styles.productName} numberOfLines={1}>
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
        <View style={styles.ratingContainer}>
           <Icon name="star" size={14} color="#F4B400" />
          <Text style={styles.ratingText}>{product.rating} (2k+ ratings)</Text>
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
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 1},
    // shadowOpacity: 0.1,
    // shadowRadius: 2,
    // elevation: 2,
  },
  gridLeft: {
    marginRight: 6,
  },
  gridRight: {
    marginLeft: 6,
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
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    backgroundColor: '#fff',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  storeBadge: {
    width: '100%',
    height: 58,
    backgroundColor: '#DDCF82',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  storeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222222',
    lineHeight: 15,
    letterSpacing: 0.1,
  },
  storeLocation: {
    fontSize: 10,
    fontWeight: '500',
    color: '#222222',
    lineHeight: 15,
    letterSpacing: 0.1,
  },
  storeMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 10,
    lineHeight: 17,
    color: '#636363',
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  productInfo: {
    top:10,
    paddingHorizontal: 10,
    gap: 5,
    marginBottom: 10,
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
  },
  price: {
    fontSize: 12,
    fontWeight: '600',
    color: '#222',
    marginRight: 6,
    lineHeight: 15,
    letterSpacing: 0.1,
  },
  originalPrice: {
    fontSize: 12,
    color: '#636363',
    textDecorationLine: 'line-through',
    marginRight: 6,
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
  ratingContainer:{
    flexDirection:'row',
    alignItems:'center',
    gap:4
  },
  ratingText:{
    fontSize: 12,
    fontWeight: '400',
    color: '#636363',
    letterSpacing: 0.1,
  },
});
