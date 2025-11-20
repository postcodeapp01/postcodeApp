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
import NearbyStores from './homePageComponents/NearbyStores/NearbyStores';
import homeStyles from '../../sources/styles/HomeStyles';
import {HomeStackParamList} from '../../navigators/stacks/HomeStack';
import PickByCategory from './homePageComponents/PickByCategory';
import ShopByBrands from './homePageComponents/ShopByBrands/ShopByBrands';
import LocationSelector from './homePageComponents/LocationSelector';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import {RootState} from '../../Store';
import BestSellers from './homePageComponents/BestSellers/BestSellers';
import {StoreRecommendation} from './homePageComponents/Recommendations/StoreRecommendationCard';
import RecommendedForYou from './homePageComponents/Recommendations/RecommendedForYou';
import CartIcon from '../common/CartIcon';
import axiosInstance from '../../config/Api';
import {MenSection} from './screens/MenSection';
import {WomenSection} from './screens/WomenSection';
import {KidsSection} from './screens/KidsSection';

type NavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  'HomeScreen'
>;

export default function Home() {
  const navigation = useNavigation<NavigationProp>();
  const [recommendedStores, setRecommendedStores] = useState<
    StoreRecommendation[]
  >([]);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const user = useSelector((state: RootState) => state.user.userDetails);
  useEffect(() => {
    async function loadRecommended() {
      try {
        if (!user?.location?.lat || !user?.location?.lng) return;
        const lat = Number(user.location.lat);
        const lng = Number(user.location.lng);
        const resp = await axiosInstance.get('/stores/recommended', {
          params: {lat, lng, radius: 50, limit: 20},
        });
        const data = resp.data?.data ?? [];
        const recs = data.map((s: any) => ({
          id: String(s.id),
          name: s.name,
          category: 'Unknown',
          image: s.logo,
          distance: `${Number(s.distance_km).toFixed(1)} km`,
          deliveryTime: s.offer ?? '—',
          rating: Number(s.rating) || 0,
          reviewCount: '',
          discount: s.offer ?? '',
          raw: s,
        }));
        setRecommendedStores(recs);
      } catch (err) {
        console.error('Failed to load recommended stores', err);
      }
    }
    loadRecommended();
  }, [user?.location?.lat, user?.location?.lng]);
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
    navigation.navigate('StoreScreen', {storeId: store.id});
  };

  return (
    <View style={{flex: 1}}>
      <ScrollView
        style={homeStyles.homeContainer}
        showsVerticalScrollIndicator={false}>
        <LocationSelector showBanner={false} />
        <View style={styles.topRow}>
          <TouchableOpacity
            style={styles.searchBar}
            onPress={() => navigation.navigate('SearchScreen')}>
            <Ionicons
              name="search-outline"
              size={17.5}
              color="#AAAAAA"
              style={{marginRight: 8}}
            />
            <View style={styles.textContainer}>
              <Text
                style={styles.searchText}
                numberOfLines={1}
                ellipsizeMode="tail">
                Search by store, product, brand or category...
              </Text>
            </View>
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
            {user?.location?.lat && user?.location?.lng && (
              <NearbyStores
                latitude={user.location.lat}
                longitude={user.location.lng}
                distance={50}
              />
            )}
            <ShopByBrands />
            <BestSellers />

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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#AAAAAA',
    borderRadius: 10,
    height: 40,
    paddingHorizontal: 10,
    marginRight: 12,
    overflow: 'hidden',
  },
  textContainer: {
    flex: 1,
    overflow: 'hidden',
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
    shadowOpacity: 0.25,
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
