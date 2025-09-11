import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {RenderStars} from '../common/RenderStars';

interface Product {
  id: string;
  name: string;
  image: any;
  price: string;
  originalPrice?: string;
  discount?: string;
  rating: string;
  brand: string;
}

interface ProductCardProps {
  product: Product;
  isLeftColumn: boolean;
  onPress: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isLeftColumn,
  onPress,
}) => {
  // console.log('ProductCard: ', product);
  // console.log('Product', product);
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isLeftColumn ? styles.leftCard : styles.rightCard,
      ]}
      onPress={onPress}>
      {/* Product Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{uri: product.image}}
          style={styles.productImage}
          resizeMode="cover"
        />
        {/* Favorite Button */}
        <TouchableOpacity style={styles.favoriteButton}>
          <Icon name="heart-outline" size={16} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Product Info */}
      <View style={styles.productInfo}>
        <Text style={styles.brand}>{product.brand}</Text>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        
        {RenderStars(product.rating)}
        {/* Price Row */}
        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{product.price}</Text>
          {product.originalPrice && (
            <Text style={styles.originalPrice}>₹{product.originalPrice}</Text>
          )}
        </View>

        {/* Rating */}
        {/* <View style={styles.ratingContainer}>
          <Icon name="star" size={12} color="#FFD700" />
          <Text style={styles.ratingText}>{product.rating}</Text>
        </View> */}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 245,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  leftCard: {
    width: '48%',
    marginRight: '2%',
  },
  rightCard: {
    width: '48%',
    marginLeft: '2%',
  },
  imageContainer: {
    position: 'relative',
  },
  productImage: {
    width: 172,
    height: 160,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  favoriteButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 6,
  },
  productInfo: {
    height: 80,
  },
  brand: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    lineHeight: 15,
    letterSpacing: -0.32,
  },
  productName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#909090',
    lineHeight: 15,
    letterSpacing: -0.32,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginRight: 6,
  },
  originalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 2,
  },
});

export default ProductCard;
