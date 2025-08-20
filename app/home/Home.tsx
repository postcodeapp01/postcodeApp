// import React from "react";
// import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// import { useNavigation } from '@react-navigation/native';
// import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import ImageCarousel from './components/ImageCarousels';
// import homeStyles from "../../sources/styles/HomeStyles";
// import { HomeStackParamList } from "../../navigators/stacks/HomeStack";

// type NavigationProp = NativeStackNavigationProp<HomeStackParamList, 'HomeScreen'>;

// export default function Home() {
//   const navigation = useNavigation<NavigationProp>();

//   return (
//     <View style={homeStyles.homeContainer}>
//       {/* 🔍 Global Search Bar */}
//       <TouchableOpacity
//         style={styles.searchBar}
//         onPress={() => navigation.navigate('SearchScreen')}
//       >
//         <Text style={styles.searchText}>Global Search</Text>
//       </TouchableOpacity>
//         <Text>Hiii Nithin</Text>

//       {/* Image Carousel or Other Content */}
//       <ImageCarousel />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   searchBar: {
//     backgroundColor: '#f0f0f0',
//     padding: 12,
//     margin: 12,
//     borderRadius: 8,
//   },
//   searchText: {
//     color: '#888',
//     fontSize: 16,
//   },
// });
import React, {useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import ImageCarousel from './components/ImageCarousels';
import NearbyStores from './components/NearbyStores/NearbyStores';
import homeStyles from '../../sources/styles/HomeStyles';
import {HomeStackParamList} from '../../navigators/stacks/HomeStack';
import PickByCategory from './components/PickByCategory/PickByCategory';
import ShopByBrands from './components/ShopByBrands/ShopByBrands';
import DeliveringNearYou from './components/DeliveringNearYou/DeliveringNearYou';
import {fetchStores} from '../../reduxSlices/storeSlice';
import {AppDispatch} from '../../Store';
import {useDispatch} from 'react-redux';
import { fetchCategories } from '../../reduxSlices/categorySlice';

type NavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  'HomeScreen'
>;

export default function Home() {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    // ✅ Fetch all global data when home loads
    dispatch(fetchStores());
    dispatch(fetchCategories());
    // dispatch(fetchBrands());
  }, [dispatch]);
  return (
    <ScrollView
      style={homeStyles.homeContainer}
      showsVerticalScrollIndicator={false}>
      {/* 🔍 Global Search Bar */}
      <TouchableOpacity
        style={styles.searchBar}
        onPress={() => navigation.navigate('SearchScreen')}>
        <Text style={styles.searchText}>Global Search</Text>
      </TouchableOpacity>

      {/* Image Carousel */}
      <ImageCarousel />

      {/* Nearby Stores Section */}
      <NearbyStores />
      <PickByCategory />

      <ShopByBrands />
      <DeliveringNearYou />
      <ShopByBrands />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    margin: 12,
    borderRadius: 8,
  },
  searchText: {
    color: '#888',
    fontSize: 16,
  },
});
