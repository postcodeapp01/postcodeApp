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
import LocationSelector from './components/LocationSelector';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {KidsSection} from '../screens/KidsSection';
import {WomenSection} from '../screens/WomenSection';
import {MenSection} from '../screens/MenSection';
import DeliveryNearYouComponent from './components/DeliveryNearYou';
import {useSelector} from 'react-redux';
import {RootState} from '../../Store';
import BestSellers from './components/BestSellers/BestSellers';
import { StoreRecommendation } from './components/Recommendations/StoreRecommendationCard';
import RecommendedForYou from './components/Recommendations/RecommendedForYou';
import CartIcon from '../common/CartIcon';

type NavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  'HomeScreen'
>;

export default function Home() {
  const navigation = useNavigation<NavigationProp>();
   const [recommendedStores, setRecommendedStores] = useState<StoreRecommendation[]>([]);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const user = useSelector((state: RootState) => state.user.userDetails);
  useEffect(() => {
    const sampleStores: StoreRecommendation[] = [
      {
        id: '1',
        name: 'Max',
        category: 'Fashion',
        image: 'https://res.cloudinary.com/dy6bwdhet/image/upload/v1761393207/Frame_1000002839_vesfhj.png',
        distance: '1 km',
        deliveryTime: '45-50 Mins',
        rating: 4.3,
        reviewCount: '2k+ ratings',
        discount: 'UPTO 35% OFF',
      },
      {
        id: '2',
        name: 'Centro',
        category: 'FootWear',
        image: 'https://res.cloudinary.com/dy6bwdhet/image/upload/v1761393207/Frame_1000002839_vesfhj.png',
        distance: '1 km',
        deliveryTime: '45-50 Mins',
        rating: 4.3,
        reviewCount: '3k+ ratings',
        discount: 'UPTO 18% OFF',
      },
      // Add more stores
    ];  setRecommendedStores(sampleStores);
  }, []);
  const handleCategoryPress = (categoryId: number) => {
    if (categoryId === 65) {
      navigation.navigate('MoreScreen');
    } else if (categoryId === -1) {
      setActiveCategory(null);
    } else {
      setActiveCategory(categoryId);
    }
  };
  const handleSeeAll = () => {
    console.log('See all stores');
  };

  const handleStorePress = (store: any) => {
    console.log('Store pressed:', store.name);
  };

  return (
    <View style={{flex: 1}}>
      <ScrollView
        style={homeStyles.homeContainer}
        showsVerticalScrollIndicator={false}>
        <LocationSelector showBanner={true} />
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
            <Text style={styles.searchText}>Search by store, product, ca...</Text>
          </TouchableOpacity>
          {/* icons  */}
          <View style={styles.rightIcons}>
            <TouchableOpacity
              onPress={() => navigation.navigate('NotificationsScreen')}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
              style={styles.iconButton}>
              <View style={styles.circleButton}>
                <Ionicons name="notifications-outline" size={22} color="#222" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('WishlistScreen' as never)}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
              style={styles.iconButton}>
              <View style={styles.circleButton}>
                <Ionicons name="heart-outline" size={22} color="#222" />
              </View>
            </TouchableOpacity>

            
            <View style={styles.iconButton}>
            <CartIcon size={22} color="#222" />
          </View>
          </View>
        </View>
        <PickByCategory onCategoryPress={handleCategoryPress} />

        {activeCategory === null ? (
          <>
            {/* <ImageCarousel /> */}
            {user?.location?.lat && user?.location?.lng && (
              <NearbyStores
                latitude={user.location.lat}
                longitude={user.location.lng}
                distance={50}
              />
            )}
            <ShopByBrands />
            <BestSellers />
            {/* <DeliveryNearYouComponent
              onSeeAll={handleSeeAll}
              onStorePress={handleStorePress}
            /> */}
            <RecommendedForYou
          stores={recommendedStores} 
          onStorePress={handleStorePress} 
        />
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
    height: 60,
    backgroundColor: '#fff',
  },
  searchBar: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#AAAAAA',
    height: 40,
    marginRight: 12,
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
  circleButton: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: .25,
    shadowRadius: 8,
    elevation: 8,
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
