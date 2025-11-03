import React from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  ListRenderItemInfo,
} from 'react-native';
import { StoreGroup } from '../../../reduxSlices/cartSlice';
import CartItem from './CartItem';

interface Props {
  store: StoreGroup;
  // optional handlers if you want later
  onQtyChange?: (cartId: number, qty: number) => void;
  onRemove?: (cartId: number) => void;
  onSizeChange?: (cartId: number, size: string) => void;
}

const StoreAndProducts: React.FC<Props> = ({
  store,
  onQtyChange = () => {},
  onRemove = () => {},
  onSizeChange = () => {},
}) => {
  // Safe totals: parse strings, handle missing values and qty
  const sumPrice = store.items.reduce((acc, it) => {
    const p = parseFloat(String(it.price ?? '0')) || 0;
    const qty = Number(it.qty) || 0;
    return acc + p * qty;
  }, 0);

  const sumOriginal = store.items.reduce((acc, it) => {
    const op = parseFloat(String(it.originalPrice  ?? '0')) || 0;
    const qty = Number(it.qty) || 0;
    return acc + op * qty;
  }, 0);

  // Use store.subtotal if provided, otherwise fallback to calculated sumPrice
  const displayedSubtotal = typeof store.subtotal === 'number' ? store.subtotal : sumPrice;

  return (
    <View style={styles.card}>
      {/* Header: left = store info, middle = totals, right = image */}
      <View style={styles.storeHeader}>
        <View style={styles.storeImageContainer}>
          <Image
            source={
              store.image
                ? { uri: store.image }
                : require('../../../sources/images/hm-b.png')
            }
            style={styles.storeImage}
          />
        </View>
        <View style={styles.storeInfo}>
          <Text style={styles.storeName}>{store.store_name}</Text>
          <Text style={styles.itemCount}>
            {store.items.length} item{store.items.length !== 1 ? 's' : ''}
          </Text>
        </View>

        <View style={styles.totalsContainer}>
          <Text style={styles.totalAmount}>₹{displayedSubtotal.toFixed(2)}</Text>

          {sumOriginal > displayedSubtotal ? (
            <Text style={styles.originalAmount}>₹{sumOriginal.toFixed(2)}</Text>
          ) : null}
        </View>

      </View>

      {/* Products list */}
      <FlatList
        data={store.items}
        keyExtractor={(it) => it.cartId.toString()}
        renderItem={({ item }: ListRenderItemInfo<any>) => (
          <CartItem
            item={item}
            onQtyChange={(qty: number) => onQtyChange(item.cartId, qty)}
            onRemove={() => onRemove(item.cartId)}
            onSizeChange={(size: string) => onSizeChange(item.cartId, size)}
          />
        )}
        scrollEnabled={false}
      />
    </View>
  );
};

export default StoreAndProducts;

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    backgroundColor: '#fff',
    paddingBottom: 8,
    borderColor: '#e6e6e6',
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  storeHeader: {
   flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop:10,
    paddingBottom:20,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F9FA',
  },
  storeInfo: {
    flex: 1,
    // flexDirection: 'column',
    // justifyContent: 'center',
  },
  storeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  itemCount: {
    fontSize: 12,
    color: '#6C757D',
    marginTop: 2,
  },
  totalsContainer: {
    width: 110,
    alignItems: 'flex-end',
    marginRight: 12,
  },
  totalAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222',
  },
  originalAmount: {
    fontSize: 12,
    color: '#8f8f8f',
    textDecorationLine: 'line-through',
    marginTop: 4,
  },
  storeImageContainer: {
    width: 42, 
    height: 42,
    borderRadius: 21, 
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', 
    marginRight: 10,
    backgroundColor: '#ada5a5ff',
  },
  storeImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
