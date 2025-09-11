import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
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
  isLeftColumn: boolean;
};

const {width} = Dimensions.get('window');
const cardWidth = 170; // 16px padding + 16px gap

const WishlistProductCard: React.FC<Props> = ({
  product,
  onRemove,
  onAddToCart,
  onPress,
  isLeftColumn,
}) => {
  return (
    <View
      style={[
        styles.card,
        {width: cardWidth},
        !isLeftColumn && styles.rightCard,
      ]}>
      {/* Product Image */}
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <Image
          source={require('../../../../sources/images/c1.png')}
          style={styles.productImage}
          defaultSource={require('../../../../sources/images/c1.png')}
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
          {/* Remove (Trash) */}
          <TouchableOpacity
            style={styles.removeButton}
            onPress={onRemove}
            activeOpacity={0.8}>
            <Icon name="delete-outline" size={15} color="#AAA" />
          </TouchableOpacity>

          {/* Add to Cart */}
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
    height:240,
    backgroundColor: '#FFFFFF',
    
    marginBottom: 10,
    // overflow: 'hidden',
  },
  rightCard: {
    marginLeft: 20,
  },
  productImage: {
    width: 170,
    height: 176,
    resizeMode: 'cover',
    borderTopRightRadius:10,
    borderTopLeftRadius:10
  },
  productInfo: {
    padding: 5,
  },
  brandName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#000',
    lineHeight:15,
  },
  productName: {
    fontSize: 10,
    fontWeight: '500',
    color: '#AAAAAA',
    lineHeight: 15,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 5,
  },
  currentPrice: {
    fontSize: 12,
    fontWeight: '600',
    color: '#222',
    marginRight: 5,
  },
  originalPrice: {
    fontSize: 12,
    color: '#AAAAAA',
    textDecorationLine: 'line-through',
    marginRight: 5,
    // lineHeight:10,
    letterSpacing:-0.32,
  },
  discountPercentage: {
    fontSize: 10,
    color: '#B51C0F',
    fontWeight: '600',
    letterSpacing:-0.32,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height:25,
  },
  removeButton: {
    width:25,
    padding: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#AAA',
    
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF5964',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 9,
  },
  addToCartText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 5,
    letterSpacing:-0.32,
  },
});
