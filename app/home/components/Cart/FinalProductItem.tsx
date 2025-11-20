import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

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

const formatPrice = (price: number) => {
  return `₹${price.toLocaleString('en-IN')}`;
};

const FinalProductItem: React.FC<{ item: CartItem }> = ({ item }) => {
  console.log("Itm in final product",item)
  return (
    <View>
      <View style={styles.itemCard}>
        <Image
          source={
            item.image
              ? { uri: item.image }
              : require('../../../../sources/images/c1.png')
          }
          style={styles.itemImage}
          resizeMode="cover"
        />
        <View style={styles.itemDetailsContainer}>
          <Text style={styles.itemBrand} numberOfLines={1}>
            {item.brand}
          </Text>
          <Text style={styles.itemName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.itemMeta}>
            Size: {item.size} | Qty: {item.qty}
          </Text>
          <View style={styles.priceRow}>
            <Text style={styles.currentPrice}>{formatPrice(Number(item.price) || 0)}</Text>
          </View>
        </View>
      </View>
      <View style={styles.itemDivider} />
    </View>
  );
};

const styles = StyleSheet.create({
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
    lineHeight: 20,
  },
  itemName: {
    fontSize: 12,
    fontWeight: '400',
    color: '#636363',
    lineHeight: 15,
    letterSpacing: 0.1,
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
    lineHeight: 15,
    letterSpacing: 0.1,
  },
  itemDivider: {
    height: 1,
    backgroundColor: '#f8f8f8',
    marginHorizontal: 12,
  },
});

export default FinalProductItem;
