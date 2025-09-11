import React from "react";
import { View, StyleSheet } from "react-native";
import DeliveryNearYouHeader from "./DeliveryNearYou/DeliveryNearYouHeader";
import DeliveryNearYouList from "./DeliveryNearYou/DeliveryNearYouList";


const stores = [
  {
      id: '1',
      name: 'Zudio',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
      rating: 4.2,
      reviewCount: '2000+',
      distance: '0.3 km',
      isOpen: true,
      deliveryTime: '30-45 mins',
      category: 'Fashion',
    },
    {
      id: '2',
      name: 'South India Shopping Mall',
      image: 'https://images.unsplash.com/photo-1555529669-2269763671c0?w=400&h=300&fit=crop',
      rating: 4.0,
      reviewCount: '2000+',
      distance: '0.9 km',
      isOpen: true,
      deliveryTime: '45-60 mins',
      category: 'Shopping Mall',
    },
    {
      id: '3',
      name: 'Fashion Central',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
      rating: 4.3,
      reviewCount: '1500+',
      distance: '0.7 km',
      isOpen: true,
      deliveryTime: '25-40 mins',
      category: 'Fashion',
    },
    {
      id: '4',
      name: 'Metro Store',
      image: 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=400&h=300&fit=crop',
      rating: 3.9,
      reviewCount: '800+',
      distance: '1.2 km',
      isOpen: false,
      deliveryTime: '50-65 mins',
      category: 'Grocery',
    },
  // ...rest
];

const DeliveryNearYouComponent = ({ onSeeAll, onStorePress }) => (
  <View style={styles.container}>
    <DeliveryNearYouHeader onSeeAll={onSeeAll} />
    <DeliveryNearYouList stores={stores} onStorePress={onStorePress} />
  </View>
);

export default DeliveryNearYouComponent;

const styles = StyleSheet.create({
  container: { backgroundColor: "#fff", paddingVertical: 20 },
});
