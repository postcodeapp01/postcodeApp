import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../../app/home/Home';
import HomeHeader from '../../app/home/header/HomeHeader';
import SearchScreen from '../../app/screens/SearchScreen';
import ProductDetails from '../../app/screens/ProductDetails';
import AddAddress from '../../app/address/AddAddress';
import StoreScreen from '../../app/screens/StoreScreen';
import ProductsScreen from '../../app/screens/ProductScreen';

export type HomeStackParamList = {
  HomeScreen: undefined;
  SearchScreen: undefined;
  ProductDetails: { product: any };
  AddAddress: undefined;
  ProductsScreen: {
    categoryName: string;
    subcategory: string | null;
  };
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
      <Stack.Screen
        name="ProductsScreen"
        component={ProductsScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AddAddress"
        component={AddAddress}
        options={{
          title: "Select Delivery Location"
        }}
      />
    </Stack.Navigator>
  );
}
