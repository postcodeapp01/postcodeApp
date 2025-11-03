import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import StoreInfo from '../components/Store/StoreInfo';
import RecommendedProducts from '../components/Store/RecommendedProducts';
import BottomActionBar from '../components/Store/BottomActionBar';
import {useRoute, RouteProp, useNavigation} from '@react-navigation/native';
import axiosInstance from '../../config/Api';
import {Text} from '@react-navigation/elements';
import ProductsHeader from '../components/Products/ProductsHeader';
import {useDispatch, useSelector} from 'react-redux';
import {selectBookmarkUpdating, selectIsBookmarked, toggleBookmark} from '../../reduxSlices/bookmarkSlice';
type StoreScreenRouteParams = {
  storeId: string;
};
const StoreScreen: React.FC = () => {
  const route =
    useRoute<RouteProp<{StoreScreen: StoreScreenRouteParams}, 'StoreScreen'>>();
  const {storeId} = route.params;
  // console.log('store id in store screnn', storeId);
  const navigation = useNavigation();
  const [storeData, setStoreData] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const isBookmarked = useSelector((state: any) =>
    selectIsBookmarked(state, storeId),
  );
  const updating=useSelector((state: any) =>selectBookmarkUpdating(state, storeId));
 const onBookmarkPress = useCallback(() => {
    if (updating) return;
    dispatch(toggleBookmark({storeId}));
  }, [dispatch, storeId, updating]);
  const fetchStoreData = async () => {
    try {
      setLoading(true);
      const [storeRes, productRes] = await Promise.all([
        axiosInstance.get(`/stores/details/${storeId}`),
        axiosInstance.get(`/stores/${storeId}/products`),
      ]);

      setStoreData(storeRes.data);
      setProducts(productRes.data);
    } catch (error) {
      console.error('Error fetching store data:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (storeId) fetchStoreData();
  }, []);
  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={{marginTop: 8, color: '#555'}}>Loading store...</Text>
      </SafeAreaView>
    );
  }
  if (!storeData) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={{color: '#999'}}>Store not found.</Text>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        <ProductsHeader
          onBack={() => navigation.goBack()}
          store={true}
          isBookmarked={isBookmarked}
          onBookmarkPress={onBookmarkPress}
          bookmarkLoading={updating}
        />
        <StoreInfo store={storeData} />
        <RecommendedProducts products={products} />
      </ScrollView>
      <BottomActionBar storeId={storeId} />
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
