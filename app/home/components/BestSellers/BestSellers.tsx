// components/home/BestSellers.tsx
import React from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import OfferCard from './OfferCard';

interface BestSellerItem {
  id: string;
  image: any;
  discount: string;
  category: string;
  brandLogo?: any;
  brandName?: string;
}

interface BestSellersProps {
  onOfferPress?: (item: BestSellerItem) => void;
}

const BestSellers: React.FC<BestSellersProps> = ({onOfferPress}) => {
  const bestSellerItems: BestSellerItem[] = [
    {
      id: '1',
      image: require('../../../../sources/images/c1.png'),
      discount: 'UPTO 80% OFF',
      category: 'Ethnic wear',
      brandLogo: require('../../../../sources/images/i.png'),
      brandName: 'Indo Era',
    },
    {
      id: '2',
      image: require('../../../../sources/images/c1.png'),
      discount: 'UPTO 20% OFF',
      category: 'Men Formals',
      brandLogo: require('../../../../sources/images/p.png'),
      brandName: 'Pantaloon',
    },
    // Add more items as needed
  ];

  const renderItem = ({item}: {item: BestSellerItem}) => (
    <OfferCard
      image={item.image}
      discount={item.discount}
      category={item.category}
      brandLogo={item.brandLogo}
      brandName={item.brandName}
      onPress={() => onOfferPress?.(item)}
    />
  );

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <Text style={styles.sectionTitle}>Best Sellers</Text>

      {/* Horizontal List */}
      <FlatList
        horizontal
        data={bestSellerItems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#F4B400',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
});

export default BestSellers;
