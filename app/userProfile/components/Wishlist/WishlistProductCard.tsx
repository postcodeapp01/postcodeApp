import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ProductCard from '../../../home/components/ProductCard';

type WishlistProduct = {
  id: string;
  name: string;
  brand: string;
  imageUrl: string;
  currentPrice: number;
  originalPrice: number;
  discount: number;
  isInStock: boolean;
  store?: {
    id?: string | number;
    name?: string;
    location?: string;
    latitude?: number;
    longitude?: number;
  };
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
  const mappedProduct = {
    id: product.id,
    name: product.name,
    brand: product.brand,
    image: product.imageUrl || null,
    price: product.currentPrice ?? 0,
    originalPrice: product.originalPrice ?? null,
    discount: product.discount ?? null,
    store: product.store ?? undefined,
  };

  const handleRemove = () => {
    onRemove();
  };

  console.log('Product in the wishlist ', product);

  return (
    <View style={[styles.wrapper, {width}]}>
      {/* Product Card */}
      <View style={styles.productCardContainer}>
        <ProductCard
          product={mappedProduct}
          horizontal={false}
          onPress={onPress}
          onToggleFavorite={() => {}}
          isFavorite={true}
        />

        {/* Out of Stock Overlay */}
        {!product.isInStock && (
          <View style={styles.outOfStockOverlay}>
            <Text style={styles.outOfStockText}>Out of stock</Text>
          </View>
        )}
      </View>

      {/* Actions Row */}
      {product.isInStock ? (
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.iconButton, styles.removeButton]}
            onPress={handleRemove}
            activeOpacity={0.8}
            accessibilityLabel="Remove from wishlist">
            <Icon name="delete-outline" size={22} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={onAddToCart}
            activeOpacity={0.85}
            accessibilityLabel="Add to cart">
            <Icon name="shopping-cart" size={18} color="#fff" />
            <Text style={styles.addToCartText}>Add to cart</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.outOfStockActionsRow}>
          <TouchableOpacity
            style={styles.removeButtonOutOfStock}
            onPress={handleRemove}
            activeOpacity={0.8}
            accessibilityLabel="Remove from wishlist">
            <Icon name="delete-outline" size={21} color="#222" />
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default WishlistProductCard;

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
  },
  productCardContainer: {
    position: 'relative',
  },
  outOfStockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: -4,
    bottom: 120,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
  },
  outOfStockText: {
    borderTopColor: 'rgba(255, 255, 255, 0.5)',
    borderTopWidth: 1,
    color: '#fff',
    fontSize: 12,
    width: '100%',
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingVertical: 8,
    textAlign: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    paddingHorizontal: 10,
    paddingVertical: 8,
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    gap: 8,
  },

  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E6E6E6',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },

  removeButton: {
    paddingHorizontal: 8,
  },
  addToCartButton: {
    flex: 1,
    height: 40,
    backgroundColor: '#FF5964',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 20,
    letterSpacing: -0.32,
  },
  outOfStockActionsRow: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#fff',
    height:50,
  },

  removeButtonOutOfStock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#FF5964',
    backgroundColor: '#fff',
    height: 40,
  },

  removeButtonText: {
    color: '#222',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
    lineHeight: 20,
    letterSpacing: -0.32,
  },
});
