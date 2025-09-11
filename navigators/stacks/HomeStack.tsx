import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../../app/home/Home';
import HomeHeader from '../../app/home/header/HomeHeader';
import SearchScreen from '../../app/screens/SearchScreen';
import ProductDetails from '../../app/screens/ProductDetails';
import AddAddress from '../../app/address/AddAddress';
import StoreScreen from '../../app/screens/StoreScreen';
import ProductsScreen from '../../app/screens/ProductsScreen';
import BuyNowScreen from '../../app/screens/BuyNowScreen';
import CartScreen from '../../app/screens/CartScreen';
import CategoryScreen from '../../app/screens/CategoryScreen';
import MoreScreen from '../../app/screens/MoreScreen';
import WishlistScreen from '../../app/userProfile/screens/WishlistScreen';
import AddAddressScreen from '../../app/userProfile/screens/AddAddressScreen';
import NotificationsScreen from '../../app/screens/NotifictionsScreen';


export type HomeStackParamList = {
  HomeScreen: undefined;
  SearchScreen: undefined;
  StoreScreen: {storeId: number};
  AddAddressScreen: undefined;
  CartScreen: undefined;
  ProductDetails: {id: string; resetStack?: boolean};
  AddAddress: undefined;
  ProductsScreen: {
    id: number;
  };
  BuyNowScreen: {productId: number};
  CategoryScreen: undefined;
  MoreScreen: undefined;
  WishlistScreen: undefined;
  NotificationsScreen: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          // header: () => <HomeHeader />,
          headerShown: false,
        }}
      />
      
      <Stack.Screen
        name="MoreScreen"
        component={MoreScreen}
        options={{
              headerShown: false,
            }}
      />
          <Stack.Screen
            name="CategoryScreen"
            component={CategoryScreen}
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
        name="SearchScreen"
        component={SearchScreen}
        options={{
          title: 'Search Products',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AddAddressScreen"
        component={AddAddressScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="WishlistScreen"
        component={WishlistScreen}
        options={{
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
        name="NotificationsScreen"
        component={NotificationsScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="CartScreen"
        component={CartScreen}
        options={{
          headerShown: false, // Myntra-like full screen, hide header
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
          title: 'Select Delivery Location',
        }}
      />
      <Stack.Screen
        name="BuyNowScreen"
        component={BuyNowScreen}
        options={{
          headerShown: false, // Myntra-like full screen, hide header
        }}
      />
    </Stack.Navigator>
  );
}
