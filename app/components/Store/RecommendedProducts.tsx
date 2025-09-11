import React from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import ProductCard from '../ProductCard';
import {recommendedProducts} from './productData';

const RecommendedProducts: React.FC = () => {
  const renderProduct = ({item, index}: {item: any; index: number}) => (
    <ProductCard
      product={item}
      isLeftColumn={index % 2 === 0}
      onPress={() => console.log(`Selected product: ${item.name}`)}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Recommended For You</Text>
      <FlatList
        data={recommendedProducts}
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
    paddingVertical: 20,
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
    marginBottom: 16,
  },
});

export default RecommendedProducts;
