import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../../app/home/Home';
import HomeHeader from '../../app/home/header/HomeHeader';
import SearchScreen from '../../app/screens/SearchScreen';
import ProductDetails from '../../app/screens/ProductDetails';

export type HomeStackParamList = {
  HomeScreen: undefined;
  SearchScreen: undefined;
  ProductDetails: { product: any }; // You can refine `any` later
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          header: () => <HomeHeader />,
        }}
      />
      <Stack.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{
          title: 'Search Products',
        }}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetails}
        options={{
          title: 'Product Details',
        }}
      />
    </Stack.Navigator>
  );
}
