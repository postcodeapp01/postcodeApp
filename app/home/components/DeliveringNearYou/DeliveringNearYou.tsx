import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { deliveryProductsData } from './deliveryData';
import DeliveryCard from './DeliveryCard';


const DeliveringNearYou: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delivering in 1Hr Near You</Text>
      <View style={styles.row}>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {deliveryProductsData.map((product) => (
          <DeliveryCard
            key={product.id}
            product={product}
            onPress={() => console.log(`Selected ${product.name}`)}
          />
        ))}
      </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    height:180,
    // backgroundColor:'red'
  },
  title: {
    fontSize: 16,
    height:20,
    lineHeight:20,
    fontWeight: '500',
    color: '#000',
    marginBottom: 15,
    paddingHorizontal: 16,
  },
  row:{
    // backgroundColor:"yellow",
    height:145,
  },
  scrollContainer: {
    paddingHorizontal: 12,
  },
});

export default DeliveringNearYou;
