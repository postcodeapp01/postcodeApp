import React, {useEffect, useState, useCallback, memo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  GestureResponderEvent,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { AppDispatch } from '../../../../Store';
import { useDispatch } from 'react-redux';
import { removeCartItemOnServer } from '../../../../reduxSlices/cartSlice';
import axiosInstance from '../../../../config/Api';

export interface CartItemType {
  cartId: string | number;
  productId?: string | number;
  name: string;
  brand?: string;
  price: string | number;
  originalPrice?: string | number;
  discount?: number;
  qty: number;
  image: string;
  returns?: string;
  estimatedTime?: string;
  deliveryTag?: string;
  size?: string;
  store_id?: string | number;
  store_latitude?: number;
  store_longitude?: number;
  store_name?: string;
  store_address?: string;
}

interface Props {
  item: CartItemType;
  onQtyChange: (qty: number) => void;
  onRemove: () => void;
  onSizeChange?: (size: string) => void;
}

const sampleSizes = ['XS', 'S', 'M', 'L', 'XL'];

const formatPrice = (p: string | number) => {
  const price = typeof p === 'string' ? parseFloat(p) : p;
  return `₹${price.toFixed(0)}`;
};

const CartItem: React.FC<Props> = memo(
  ({item, onQtyChange, onRemove, onSizeChange}) => {
    const {
      name,
      brand,
      price,
      originalPrice,
      discount,
      qty,
      image,
      returns: ret,
      estimatedTime,
      size,
    } = item;

    const [qtyInput, setQtyInput] = useState(String(qty));
    const [isRemoving, setIsRemoving] = useState(false);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
      if (!isRemoving) {
        setQtyInput(String(qty));
      }
    }, [qty, isRemoving]);

    const handleQtyIncrease = useCallback(
      (e?: GestureResponderEvent) => {
        if (isRemoving) return;
        const next = qty + 1;
        setQtyInput(String(next));
        onQtyChange(next);
      },
      [qty, onQtyChange, isRemoving],
    );

    const handleQtyDecrease = useCallback(
      (e?: GestureResponderEvent) => {
        if (isRemoving) return;
        const next = qty <= 1 ? 1 : qty - 1;
        setQtyInput(String(next));
        onQtyChange(next);
      },
      [qty, onQtyChange, isRemoving],
    );

    const handleSizePress = useCallback(() => {
      if (!onSizeChange || isRemoving) return;
      const curIndex = sampleSizes.indexOf(size ?? 'XS');
      const next = sampleSizes[(curIndex + 1) % sampleSizes.length];
      onSizeChange(next);
    }, [size, onSizeChange, isRemoving]);

    const handleQtyInputChange = useCallback(
      (text: string) => {
        if (isRemoving) return;

        const numericValue = text.replace(/[^0-9]/g, '');
        setQtyInput(numericValue);

        if (numericValue) {
          const parsedQty = Math.max(
            1,
            Math.min(99, parseInt(numericValue, 10)),
          );
          onQtyChange(parsedQty);
        } else {
          setQtyInput('1');
          onQtyChange(1);
        }
      },
      [onQtyChange, isRemoving],
    );

    const handleRemove = useCallback(() => {
      if (isRemoving) return;

      Alert.alert(
        'Remove Item',
        'Do you want to add this item to your wishlist before removing it from the cart?',
        [
          {
            text: 'Yes, add to Wishlist',
            onPress: async () => {
              setIsRemoving(true);
              try {
                await axiosInstance.post(`/wishlist/`, {
                  productId: item.productId,
                });

                Alert.alert('Success', 'Added to wishlist!');

                await dispatch(removeCartItemOnServer(String(item.cartId))).unwrap();
              } catch (error) {
                console.error('Error while moving to wishlist:', error);
                Alert.alert('Error', 'Failed to move item. Please try again.');
              } finally {
                setIsRemoving(false);
              }
            },
          },
          {
            text: 'No, just remove',
            style: 'destructive',
            onPress: async () => {
              setIsRemoving(true);
              try {
                await dispatch(removeCartItemOnServer(String(item.cartId))).unwrap();
              } catch (error) {
                console.error('Remove cart item error:', error);
                Alert.alert('Error', 'Failed to remove item. Please try again.');
              } finally {
                setIsRemoving(false);
              }
            },
          },
          {text: 'Cancel', style: 'cancel'},
        ],
      );
    }, [dispatch, item.cartId, item.productId, isRemoving]);

    return (
      <View style={styles.card}>
        <View style={styles.cardContent}>
          {/* Left Side - Product Image */}
          <Image
            source={
              image ? {uri: image} : require('../../../../sources/images/c1.png')
            }
            style={styles.productImage}
          />

          {/* Right Side - Product Details */}
          <View style={styles.detailsContainer}>
            {/* Close Button */}
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={handleRemove}
              disabled={isRemoving}>
              {isRemoving ? (
                <ActivityIndicator size="small" color="#888" />
              ) : (
                <Ionicons name="close" size={18} color="#AAA" />
              )}
            </TouchableOpacity>

            {/* Brand/Description */}
            <Text style={styles.brand} numberOfLines={1}>
              {brand || 'Women V-Neck Regular Fit Top'}
            </Text>
            {/* Product Name */}
            <Text style={styles.productName} numberOfLines={2}>
              {name}
            </Text>
            

            {/* Selectors Row */}
            <View style={styles.selectorsRow}>
              {/* Quantity Dropdown */}
              <TouchableOpacity style={styles.dropdown} disabled={isRemoving}>
                <Text style={styles.dropdownLabel}>Qty {qtyInput}</Text>
                <MaterialIcons name="arrow-drop-down" size={18} color="#333" />
              </TouchableOpacity>

              {/* Size Dropdown */}
              <TouchableOpacity 
                style={styles.dropdown}
                onPress={handleSizePress}
                disabled={isRemoving}>
                <Text style={styles.dropdownLabel}>Size {size || 'XS'}</Text>
                <MaterialIcons name="arrow-drop-down" size={18} color="#333" />
              </TouchableOpacity>
            </View>

            {/* Price Row */}
            <View style={styles.priceRow}>
              <Text style={styles.currentPrice}>{formatPrice(price)}</Text>
              {originalPrice && parseFloat(originalPrice.toString()) > parseFloat(price.toString()) && (
                <Text style={styles.strikePrice}>{formatPrice(originalPrice)}</Text>
              )}
              {discount && discount > 0 && (
                <Text style={styles.discountText}>{discount}% OFF</Text>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  },
);

CartItem.displayName = 'CartItem';

export default CartItem;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    height:90,
    marginBottom:25,
  },
  cardContent: {
    flexDirection: 'row',
  },
  productImage: {
    width: 75,
    height: 90,
    marginRight: 20,
    borderRadius: 5,
  },
  detailsContainer: {
    flex: 1,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  productName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#636363',
    lineHeight: 15,
    marginBottom: 5,
    letterSpacing:0.1,
  },
  brand: {
    fontSize: 14,
    color: '#222222',
    marginBottom: 2,
    lineHeight: 20,
    letterSpacing:0.1,
    fontWeight: '600',
  },
  selectorsRow: {
    flexDirection: 'row',
    gap: 5,
    marginBottom: 3,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#222',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#fff',
  },
  dropdownLabel: {
    fontSize: 10,
    color: '#222',
    fontWeight: '500',
    letterSpacing:0.1,
    lineHeight:15,
  },
  priceRow: {
    height:15,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 5,
  },
  currentPrice: {
    fontSize: 12,
    fontWeight: '600',
    color: '#222',
    lineHeight:15,
    letterSpacing:0.1,
  },
  strikePrice: {
    fontSize: 12,
    color: '#636363',
    textDecorationLine: 'line-through',
    lineHeight:15,
    letterSpacing:0.1,
  },
  discountText: {
    fontSize: 12,
    color: '#FF5964',
    fontWeight: '700',
    lineHeight:15,
    letterSpacing:0.1,
  },
});

