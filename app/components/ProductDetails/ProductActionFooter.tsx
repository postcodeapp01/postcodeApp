// ProductActionFooter.tsx
import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface ProductActionFooterProps {
  price: number;
  onWishlistToggle: () => void;
  onBuyNow: () => void;
  onAddToCart: () => void;
  isWishlisted?: boolean;
  isBuyLoading?: boolean;
  isCartLoading?: boolean;
  buyDisabled?: boolean;
  cartDisabled?: boolean;
}

const ProductActionFooter: React.FC<ProductActionFooterProps> = ({
  onWishlistToggle,
  onBuyNow,
  onAddToCart,
  isWishlisted = false,
  isBuyLoading = false,
  isCartLoading = false,
  buyDisabled = false,
  cartDisabled = false,
}) => {
  return (
    <View style={styles.footer}>
      {/* Wishlist Button */}
      <TouchableOpacity
        style={styles.iconBtn}
        onPress={onWishlistToggle}
        activeOpacity={0.7}>
        <FontAwesome
          name={isWishlisted ? 'heart' : 'heart-o'}
          size={20}
          color="#fff"
        />
      </TouchableOpacity>

      {/* Buy Now Button */}
      <TouchableOpacity
        style={[styles.actionBtn, styles.buyNowBtn]}
        onPress={onBuyNow}
        disabled={buyDisabled || isBuyLoading}
        activeOpacity={0.8}>
        <MaterialCommunityIcons name="cash" size={16} color="#fff" />
        <Text style={styles.buyNowText}>Buy now</Text>
      </TouchableOpacity>

      {/* Add to Cart Button */}
      <TouchableOpacity
        style={[styles.actionBtn, styles.addToCartBtn]}
        onPress={onAddToCart}
        disabled={cartDisabled || isCartLoading}
        activeOpacity={0.8}>
        <MaterialCommunityIcons name="cart-plus" size={16} color="#FF5964" />
        <Text style={styles.addToCartText}>Add to cart</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FF5964',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    height: 56,
    shadowColor: '#FF5964',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 36,
    borderRadius: 18,
    marginHorizontal: 6,
  },
  buyNowBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  addToCartBtn: {
    backgroundColor: '#fff',
  },
  buyNowText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 6,
  },
  addToCartText: {
    color: '#FF5964',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 6,
  },
});

export default ProductActionFooter;
