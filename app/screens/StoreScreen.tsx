import React from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import StoreHeader from '../components/Store/StoreHeader';
import StoreInfo from '../components/Store/StoreInfo';
import RecommendedProducts from '../components/Store/RecommendedProducts';
import BottomActionBar from '../components/Store/BottomActionBar';
import { useRoute } from '@react-navigation/native';

const StoreScreen: React.FC = () => {

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <StoreHeader />
        <StoreInfo />
        <RecommendedProducts />
      </ScrollView>
      <BottomActionBar />
    </SafeAreaView>
  );
};
export default StoreScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
},
scrollView: {
    flex: 1,
  },
});

