// ProductActionFooter.tsx
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface ProductActionFooterProps {
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
        activeOpacity={0.7}
      >
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
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="tag-outline" size={18} color="#fff" />
        <Text style={styles.buyNowText}>Buy now</Text>
      </TouchableOpacity>

      {/* Add to Cart Button */}
      <TouchableOpacity
        style={[styles.actionBtn, styles.addToCartBtn]}
        onPress={onAddToCart}
        disabled={cartDisabled || isCartLoading}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="shopping-outline" size={18} color="#FFF" />
        <Text style={styles.addToCartText}>Add to cart</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF5964',
    paddingVertical: 10,
    paddingHorizontal: 12,
    justifyContent: 'space-between',
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 35,
    borderRadius: 10,
    borderWidth: 2,
    marginHorizontal: 6,
  },
  buyNowBtn: {
    backgroundColor: 'transparent',
    borderColor: '#fff',
  },
  addToCartBtn: {
    backgroundColor:'transparent',
    borderColor: '#fff',
  },
  buyNowText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
    marginLeft: 6,
  },
  addToCartText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
    marginLeft: 6,
  },
});

export default ProductActionFooter;
