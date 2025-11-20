import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';
import FinalProductItem from './FinalProductItem';

interface CartItem {
  cartId: string | number;
  image?: string;
  brand: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  size: string;
  qty: number;
}

interface StoreGroup {
  store_id: string | number;
  store_name: string;
  delivery_time?: string;
  items: CartItem[];
}

interface ReviewListProps {
  storeGroups: StoreGroup[];
}

const ReviewList: React.FC<ReviewListProps> = ({storeGroups}) => {
  const renderStoreBlock = (store: StoreGroup) => (
    <View key={store.store_id} style={styles.storeBlock}>
      {/* Store Header */}
      <View style={styles.storeHeader}>
        <View style={styles.storeHeaderLeft}>
          <View style={styles.storeIcon}>
            <Image
              source={require('../../../../sources/images/c1.png')}
              style={styles.storeImage}
              resizeMode="cover"
            />
          </View>
          <View>
            <Text style={styles.storeName}>{store.store_name}</Text>
            <Text style={styles.storeRating}>2 items</Text>
          </View>
        </View>
        <Text style={styles.deliveryText}>
          DELIVERY IN {store.delivery_time || '45 MINS'}
        </Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Cart Items */}
      {Array.isArray(store.items) && store.items.length > 0 ? (
        store.items.map(item => <FinalProductItem key={item.cartId} item={item} />)
      ) : (
        <Text style={styles.emptyText}>No items in this store.</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {storeGroups.length > 0 ? (
        storeGroups.map(store => renderStoreBlock(store))
      ) : (
        <Text style={styles.emptyText}>No stores with items</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Store Block
  storeBlock: {
    backgroundColor: '#fff',
    // marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },

  // Store Header
  storeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // paddingHorizontal: 12,
    paddingVertical: 12,
  },

  storeHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },

  storeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    // justifyContent: 'center',
    // alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  storeImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20, // half of storeIcon width/height for perfect circle
  },
  storeIconText: {
    fontSize: 20,
    color: '#999',
  },

  storeName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222',
  },

  storeRating: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  deliveryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF5964',
    letterSpacing: 0.1,
    lineHeight: 15,
  },
  divider: {
    borderBottomWidth: 2,
    borderStyle: 'dotted',
    borderColor: '#AAAAAA',
    marginVertical: 8,
  },

  itemCard: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'center',
    gap: 10,
  },

  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 5,
    marginRight: 10,
  },

  itemDetailsContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },

  itemBrand: {
    fontSize: 12,
    fontWeight: '600',
    color: '#222',
    letterSpacing: 0.1,
    lineHeight:20,
  },

  itemName: {
    fontSize: 12,
    fontWeight: '400',
    color: '#636363',
    lineHeight: 15,
    letterSpacing:0.1,
  },

  itemMeta: {
    fontSize: 10,
    color: '#636363',
    fontWeight: '400',
    letterSpacing: 0.1,
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },

  currentPrice: {
    fontSize: 10,
    fontWeight: '600',
    color: '#222',
    lineHeight:15,
    letterSpacing: 0.1,
  },

  originalPrice: {
    fontSize: 11,
    color: '#999',
    textDecorationLine: 'line-through',
    fontWeight: '500',
  },

  discountBadge: {
    backgroundColor: '#fff3f3',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },

  discountText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FF6B7A',
  },

  removeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },

  itemDivider: {
    height: 1,
    backgroundColor: '#f8f8f8',
    marginHorizontal: 12,
  },

  emptyText: {
    color: '#888',
    marginLeft: 8,
    marginTop: 16,
    fontSize: 14,
  },
});

export default ReviewList;
