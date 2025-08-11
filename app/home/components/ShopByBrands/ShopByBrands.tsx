import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {brandsData} from './brandData';
import BrandCard from './BrandCard';

const ShopByBrands: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shop By Brands</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}>
        {brandsData.map(brand => (
          <View key={brand.id} style={styles.brandSpacing}>
            <BrandCard
              brand={brand}
              onPress={() => console.log(`Selected ${brand.name}`)}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',  
    height: 80,
    marginTop: 5,
    left: 17,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 15,
  },
  scrollContainer: {
    left: -8,
  },
  brandSpacing: {
    marginRight: -8,
  },
});

export default ShopByBrands;
