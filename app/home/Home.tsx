import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ImageCarousel from './components/ImageCarousels';
import homeStyles from "../../sources/styles/HomeStyles";
import { HomeStackParamList } from "../../navigators/stacks/HomeStack";

type NavigationProp = NativeStackNavigationProp<HomeStackParamList, 'HomeScreen'>;

export default function Home() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={homeStyles.homeContainer}>
      {/* 🔍 Global Search Bar */}
      <TouchableOpacity
        style={styles.searchBar}
        onPress={() => navigation.navigate('SearchScreen')}
      >
        <Text style={styles.searchText}>Global Search</Text>
      </TouchableOpacity>

      {/* Image Carousel or Other Content */}
      <ImageCarousel />
    </View>
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
