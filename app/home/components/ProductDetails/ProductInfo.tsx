import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {RenderStars} from '../../common/RenderStars';
import { Product } from '../../screens/ProductDetails';


interface Props {
  product: Product;
}

const ProductInfo: React.FC<Props> = ({product}) => {
  console.log("product",product)
  return (
    <View>
      <View style={styles.storeContainer}>
        <Text style={styles.storeName}>{product.store.name}</Text>
        <Text style={styles.storeLocation}>{product.store.location}</Text>
      </View>
      <View style={styles.container}>
        <Text style={styles.brand}>{product.brand.name}</Text>
        <Text style={styles.name}>{product.name}</Text>
        {/* {RenderStars(product.rating)} */}
        <View style={styles.priceContainer}>
          <Text style={styles.price}>₹ {product.price}</Text>
          <Text style={styles.oldPrice}>₹ {product.oldPrice}</Text>
          <Text style={styles.discount}>{product.discount}% OFF</Text>
        </View>
        <View style={styles.ratingContainer}>
          <Icon name="star" size={14} color="#F4B400" />
          <Text style={styles.ratingText}>{product.rating} (2k+ ratings)</Text>
        </View>
      </View>
    </View>
  );
};

export default ProductInfo;

const styles = StyleSheet.create({
  storeContainer: {
    paddingHorizontal: 20,
    paddingBottom: 5,
    backgroundColor: '#DDCF82',
    paddingTop:10,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222222',
    lineHeight: 15,
    letterSpacing: 0.1,
  },
  storeLocation: {
    fontSize: 12,
    fontWeight: '500',
    color: '#222222',
    lineHeight: 15,
    letterSpacing: 0.1,
  },
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  brand: {
    fontSize: 16,
    color: '#222',
    fontWeight: '600',
    letterSpacing: -0.32,
    lineHeight: 15,
  },
  name: {
    fontSize: 14,
    lineHeight: 15,
    letterSpacing: 0.1,
    color: '#636363',
  },

  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    paddingHorizontal: 3,
  },
  price: {
    fontSize: 12,
    fontWeight: '600',
    color: '#222222',
    marginRight: 8,
    lineHeight: 15,
    letterSpacing: 0.1,
  },
  oldPrice: {
    fontSize: 12,
    color: '#636363',
    textDecorationLine: 'line-through',
    marginRight: 6,
    lineHeight: 15,
    letterSpacing: 0.1,
    fontWeight: '600',
  },
  discount: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FF5964',
    lineHeight: 15,
    letterSpacing: 0.1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop:5,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#636363',
    letterSpacing: 0.1,
  },
});
