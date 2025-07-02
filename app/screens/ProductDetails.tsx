import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';

// Define the type for your route params
type ProductDetailsRouteProp = RouteProp<{ ProductDetails: { product: any } }, 'ProductDetails'>;

type Props = {
  route: ProductDetailsRouteProp;
};

const ProductDetails: React.FC<Props> = ({ route }) => {
  const { product } = route.params;

  return (
    <View style={styles.container}>
      <Image source={{ uri: product.imageUrl }} style={styles.image} />
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>₹{product.price}</Text>
    </View>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  container: { padding: 20 },
  image: { width: '100%', height: 300 },
  name: { fontSize: 24, fontWeight: 'bold', marginTop: 16 },
  price: { fontSize: 20, color: 'gray', marginTop: 8 },
});
