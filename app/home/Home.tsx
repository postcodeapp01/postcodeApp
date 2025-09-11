import React, {useEffect, useState} from 'react';
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
import {fetchStores} from '../../reduxSlices/storeSlice';
import {fetchCategories} from '../../reduxSlices/categorySlice';
import {AppDispatch} from '../../Store';
import {useDispatch} from 'react-redux';
import LocationSelector from './components/LocationSelector';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {KidsSection} from '../screens/KidsSection';
import {WomenSection} from '../screens/WomenSection';
import {MenSection} from '../screens/MenSection';
import DeliveryNearYouComponent from './components/DeliveryNearYou';
import { fetchAddresses } from '../../reduxSlices/addressesSlice';

type NavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  'HomeScreen'
>;

export default function Home() {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const [activeCategory, setActiveCategory] = useState<number | null>(null); // NEW

  useEffect(() => {
    dispatch(fetchStores());
    dispatch(fetchCategories());
    dispatch(fetchAddresses());
  }, [dispatch]);

  // Callback when a category is clicked in PickByCategory
  const handleCategoryPress = (categoryId: number) => {
    if (categoryId === 65) {
      navigation.navigate('MoreScreen');
    } else if (categoryId === -1) {
      // "All" clicked → reset to Home page
      setActiveCategory(null);
    } else {
      setActiveCategory(categoryId);
    }
  };
  const handleSeeAll = () => {
    // Navigate to all stores screen
    console.log('See all stores');
  };

  const handleStorePress = (store: any) => {
    // Navigate to store details
    console.log('Store pressed:', store.name);
  };
 
  return (
    <View style={{flex: 1}}>
      <ScrollView
        style={homeStyles.homeContainer}
        showsVerticalScrollIndicator={false}>
        {/* Always visible */}
        <LocationSelector />

        {/* Search + right-side icons */}
        <View style={styles.topRow}>
          <TouchableOpacity
            style={styles.searchBar}
            onPress={() => navigation.navigate('SearchScreen')}>
            <Ionicons
              name="search-outline"
              size={17.5}
              color="#AAAAAA"
              style={{marginRight: 13.5}}
            />
            <Text style={styles.searchText}>Search</Text>
          </TouchableOpacity>

          <View style={styles.rightIcons}>
            <TouchableOpacity
              onPress={() => navigation.navigate('NotificationsScreen')}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
              style={styles.iconButton}>
              <Ionicons
                name="notifications-outline"
                size={22}
                color="#AAAAAA"
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('WishlistScreen' as never)}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
              style={styles.iconButton}>
              <Ionicons name="heart-outline" size={22} color="#AAAAAA" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('CartScreen' as never)}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
              style={styles.iconButton}>
              {/* Use 'bag-outline' or 'bag-handle-outline' based on your Ionicons version */}
              <Ionicons name="bag-outline" size={22} color="#AAAAAA" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Always visible categories */}
        <PickByCategory onCategoryPress={handleCategoryPress} />

        {/* Conditional rendering of main section */}
        {activeCategory === null ? (
          <>
            <ImageCarousel />
            <NearbyStores />
            <ShopByBrands />
            <DeliveryNearYouComponent
              onSeeAll={handleSeeAll}
              onStorePress={handleStorePress}
            />
            <ShopByBrands />
            <ShopByBrands />
          </>
        ) : (
          <View>
            <View style={{flex: 1}}>
              {activeCategory === 1 && <MenSection parentId={activeCategory} />}
              {activeCategory === 2 && (
                <WomenSection parentId={activeCategory} />
              )}
              {activeCategory === 3 && (
                <KidsSection parentId={activeCategory} />
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 6,
  },
  searchBar: {
    flex: 1,
    // width:240,
    backgroundColor: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#AAAAAA',
    height: 34,
    marginRight: 12, // space before the icons
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchText: {
    color: '#AAAAAA',
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    paddingHorizontal: 6,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  categoryHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 10,
  },
});
