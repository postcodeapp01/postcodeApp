import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../../app/home/Home';
import SearchScreen from '../../app/home/screens/SearchScreen';
import ProductDetails from '../../app/home/screens/ProductDetails';
import StoreScreen from '../../app/home/screens/StoreScreen';
import ProductsScreen from '../../app/home/screens/ProductsScreen';
import BuyNowScreen from '../../app/home/screens/BuyNowScreen';
import CartScreen from '../../app/home/screens/CartScreen';
import CategoryScreen from '../../app/home/screens/CategoryScreen';
import MoreScreen from '../../app/home/screens/MoreScreen';
import WishlistScreen from '../../app/userProfile/screens/WishlistScreen';
import AddAddressScreen from '../../app/userProfile/screens/AddAddressScreen';
import NotificationsScreen from '../../app/home/screens/NotifictionsScreen';
import PaymentSuccessScreen from '../../app/home/components/Cart/PaymentSuccessPage';
import PaymentScreen from '../../app/home/screens/PaymentScreen';
import ViewMoreScreen from '../../app/home/screens/ViewMoreScreen';
import OfferListScreen from '../../app/home/screens/OfferListScreen';
import BrandProductsScreen from '../../app/home/screens/BrandProductsScreen';

export type HomeStackParamList = {
  HomeScreen: undefined;
  SearchScreen: undefined;
  StoreScreen: {storeId: number};
  AddAddressScreen: undefined;
  CartScreen: undefined;
  ProductDetails: {id: string; resetStack?: boolean};
  ProductsScreen: {
    id: number;
  };
  BuyNowScreen: {productId: number};
  CategoryScreen: undefined;
  MoreScreen: undefined;
  WishlistScreen: undefined;
  NotificationsScreen: undefined;
  PaymentSuccessScreen: {
    transactionId: string;
    paymentMethod: string;
    dateTime: string;
    amount: number;
    orderId: string;
    orderItems: any[];
  };
  Payment: undefined;
  ViewMoreScreen:any;
  OfferList:any;
  BrandProducts:{
    id?:string;
    name?:string;
  }
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
        name="Payment"
        component={PaymentScreen}
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
        name="ViewMoreScreen"
        component={ViewMoreScreen}
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
          headerShown: false, 
        }}
      />
      <Stack.Screen name="OfferList" component={OfferListScreen}  options={{
          headerShown: false,
        }}/>
      <Stack.Screen name="BrandProducts" component={BrandProductsScreen}  options={{
          headerShown: false,
        }}/>
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetails}
        options={{
          title: 'Product Details',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PaymentSuccess"
        component={PaymentSuccessScreen}
        options={{
          title: 'Payment Success',
          headerShown: false,
        }}
      />
      
      <Stack.Screen
        name="BuyNowScreen"
        component={BuyNowScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
