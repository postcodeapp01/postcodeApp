import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

type WishlistProduct = {
  id: string;
  name: string;
  brand: string;
  imageUrl: string;
  currentPrice: number;
  originalPrice: number;
  discount: number;
  isInStock: boolean;
};

type Props = {
  product: WishlistProduct;
  onRemove: () => void;
  onAddToCart: () => void;
  onPress: () => void;
  width: number; 
};

const WishlistProductCard: React.FC<Props> = ({
  product,
  onRemove,
  onAddToCart,
  onPress,
  width,
}) => {
  const IMAGE_HEIGHT = width * 1.05; // keep a consistent aspect ratio

  return (
    <View style={[styles.card, {width}]}>
      {/* Product Image */}
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <Image
          source={require('../../../../sources/images/c1.png')}
          style={[styles.productImage, {width, height: IMAGE_HEIGHT}]}
        />
      </TouchableOpacity>

      {/* Product Info */}
      <View style={styles.productInfo}>
        <Text style={styles.brandName}>{product.brand}</Text>
        <Text style={styles.productName} numberOfLines={1}>
          {product.name}
        </Text>

        {/* Price Row */}
        <View style={styles.priceContainer}>
          <Text style={styles.currentPrice}>₹ {product.currentPrice}</Text>
          <Text style={styles.originalPrice}>₹ {product.originalPrice}</Text>
          <Text style={styles.discountPercentage}>{product.discount}% OFF</Text>
        </View>

        {/* Bottom Buttons */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
            <Icon name="delete-outline" size={15} color="#AAA" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={onAddToCart}
            activeOpacity={0.8}>
            <Icon name="shopping-cart" size={16} color="#FFFFFF" />
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default WishlistProductCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
  },
  productImage: {
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 8,
  },
  brandName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#000',
  },
  productName: {
    fontSize: 10,
    fontWeight: '500',
    color: '#AAAAAA',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    flexWrap: 'wrap',
  },
  currentPrice: {
    fontSize: 12,
    fontWeight: '600',
    marginRight: 5,
    color: '#222',
  },
  originalPrice: {
    fontSize: 12,
    color: '#AAAAAA',
    textDecorationLine: 'line-through',
    marginRight: 5,
  },
  discountPercentage: {
    fontSize: 10,
    color: '#B51C0F',
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CCC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FF5964',
    marginLeft: 8,
    borderRadius: 6,
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 4,
  },
});
