import React from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import ProductCard from '../ProductCard';
import { useNavigation } from '@react-navigation/native';

type RecommendedProductsProps = {
  products?: any[]; 
};

const RecommendedProducts: React.FC<RecommendedProductsProps> = ({products}) => {
  const navigation=useNavigation();

  const renderProduct = ({item, index}: {item: any; index: number}) => (
    <ProductCard
      product={item}
      horizontal={false}
      horizontalCardWidth={190}
      onPress={() => navigation.navigate('ProductDetails', {id: item.id, resetStack: true})}
    />
  );

  return (
    <View style={styles.container}>
      
      <FlatList
        data={products}
        renderItem={renderProduct}
        numColumns={2}
        scrollEnabled={false}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.productGrid}
        keyExtractor={item => item.id}
        removeClippedSubviews={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  productGrid: {
    paddingBottom: 100, // Space for bottom action bar
  },
  row: {
    justifyContent: 'space-between',
    // marginBottom: 16,
  },
});

export default RecommendedProducts;
