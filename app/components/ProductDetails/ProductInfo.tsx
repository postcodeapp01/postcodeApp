import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {renderStars} from '../../common/renderStars';

interface Product {
  brand: string;
  name: string;
  rating: number;
  price: number;
  oldPrice: number;
  discount: number;
}

interface Props {
  product: Product;
}

const ProductInfo: React.FC<Props> = ({product}) => {
  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <Text style={styles.brand}>{product.brand}</Text>
        <Text style={styles.name}>{product.name}</Text>
          {renderStars(product.rating)}
        {/* <View style={styles.ratingContainer}>
        </View> */}
        <View style={styles.priceContainer}>
          <Text style={styles.price}>₹ {product.price}</Text>
          <Text style={styles.oldPrice}>₹ {product.oldPrice}</Text>
          <Text style={styles.discount}>{product.discount}% OFF</Text>
        </View>
      </View>
    </View>
  );
};

export default ProductInfo;

const styles = StyleSheet.create({
  outerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    height: 93,
  },
  container: {
    backgroundColor: '#fff',
    height: 73,
  },
  brand: {
    fontSize: 16,
    marginBottom: -4,
    color: '#000000',
    fontWeight: '500',
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  name: {
    marginBottom: -2,
    fontSize: 12,
    lineHeight: 20,
    letterSpacing: 0.1,
    color: '#AAAAAA',
    marginVertical: 4,
  },
  ratingContainer: {
    marginBottom: -4,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#222222',
    marginRight: 8,
  },
  oldPrice: {
    fontSize: 14,
    color: '#AAAAAA',
    textDecorationLine: 'line-through',
    marginRight: 6,
  },
  discount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#B51C0F',
  },
});
