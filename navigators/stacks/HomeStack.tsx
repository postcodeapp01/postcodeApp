import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../../app/home/Home';
import HomeHeader from '../../app/home/header/HomeHeader';
import SearchScreen from '../../app/screens/SearchScreen';
import ProductDetails from '../../app/screens/ProductDetails';
import AddAddress from '../../app/address/AddAddress';
import StoreScreen from '../../app/screens/StoreScreen';
import ProductsScreen from '../../app/screens/ProductsScreen';

export type HomeStackParamList = {
  HomeScreen: undefined;
  SearchScreen: undefined;
  StoreScreen: undefined;
  ProductDetails: {id:string ,resetStack?:boolean};
  AddAddress: undefined;
  ProductsScreen: {
    id:number;
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
          headerShown: false,
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
        name="StoreScreen"
        component={StoreScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetails}
        options={{
          title: 'Product Details',
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
