import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import type {RouteProp} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import ProductCard from '../components/ProductCard';
import ProductsHeader from '../components/Products/ProductsHeader';

import {HomeStackParamList} from '../../navigators/stacks/HomeStack';
import axiosInstance from '../../config/Api';

import ProductFilterBar from '../components/Products/ProductFilterBar';

import {RootState} from '../../Store';
import {useSelector} from 'react-redux';
import LocationSelector from '../home/components/LocationSelector';

type ProductsScreenRouteProp = RouteProp<HomeStackParamList, 'ProductsScreen'>;
type ProductsScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  'ProductsScreen'
>;

interface Product {
  brand: string;
  colors: any;
  sizes: any;
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  image: any;
  rating: string;
  discount?: string;
  category: string;
  subcategory: string;
}

const ProductsScreen: React.FC = () => {
  const route = useRoute<ProductsScreenRouteProp>();
  const navigation = useNavigation<ProductsScreenNavigationProp>();
  const {id: initialId} = route.params;

  const categories = useSelector(
    (state: RootState) => state.categories.categories,
  );
  const pageCategory = categories.filter(c => c.id === Number(initialId));
  const pageTitle = pageCategory ? pageCategory[0].name : 'Products';
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  // selected category (either from route or from filter)
  const [selectedCategoryId, setSelectedCategoryId] =
    useState<number>(initialId);

  // filter states
  const [sortBy, setSortBy] = useState('default');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  const [minDiscount, setMinDiscount] = useState<number>(0);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(
    null,
  );
  const [ratingFilter, setRatingFilter] = useState<string>('all');

  useEffect(() => {
    loadProducts();
  }, [
    selectedCategoryId,
    sortBy,
    selectedSizes,
    selectedColors,
    selectedBrands,
    minDiscount,
    selectedPriceRange,
    ratingFilter,
  ]);

  const buildQueryParams = () => {
    const params = new URLSearchParams();

    // backend expects "sort", not "sortBy"
    switch (sortBy) {
      case 'priceLowHigh':
        params.append('sort', 'priceLowHigh'); // backend handles this
        break;
      case 'priceHighLow':
        params.append('sort', 'priceHighLow');
        break;
      case 'rating':
        params.append('sort', 'rating');
        break;
      case 'newest':
        params.append('sort', 'newest');
        break;
      case 'popularity':
        params.append('sort', 'popularity');
        break;
      case 'relevance':
        params.append('sort', 'relevance');
        break;
      default:
        params.append('sort', 'relevance'); // default should be relevance
    }

    if (selectedSizes.length > 0)
      params.append('sizes', selectedSizes.join(','));
    if (selectedColors.length > 0)
      params.append('colors', selectedColors.join(','));
    if (selectedBrands.length > 0)
      params.append('brands', selectedBrands.join(','));

    // backend doesn’t handle minDiscount or rating yet (unless you add it)
    if (selectedPriceRange) {
      if (selectedPriceRange.includes('-')) {
        params.append('priceRange', selectedPriceRange.replace(/\s+/g, '')); // remove all spaces
      } else if (selectedPriceRange === 'Under 500') {
        params.append('priceRange', '0-500');
      } else if (selectedPriceRange === '5000+') {
        params.append('priceRange', '5000-999999');
      }
    }

    // ✅ Rating filter
    if (ratingFilter && ratingFilter !== 'all') {
      params.append('rating', ratingFilter);
    }

    console.log('Query : ', params.toString());
    return params.toString();
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const query = buildQueryParams();
      const response = await axiosInstance.get(
        `/products/level/${selectedCategoryId}?${query}`,
      );

      // console.log('✅ API Response:', response.data);

      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderProduct = ({item, index}: {item: Product; index: number}) => (
    <ProductCard
      product={item}
      isLeftColumn={index % 2 === 0}
      onPress={() => {
        navigation.navigate('ProductDetails', {id: item.id, resetStack: true});
      }}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>No Products Found</Text>
      <Text style={styles.emptySubtitle}>
        We couldn't find any products in this category.
      </Text>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ProductsHeader title="Sample" onBack={() => navigation.goBack()} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B5CF6" />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ProductsHeader
        title={pageTitle}
        onBack={() => navigation.goBack()}
        productCount={products?.length}
      />
      <LocationSelector/>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.productsList}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        removeClippedSubviews={false}
      />

      <ProductFilterBar
        onSort={(option: string) => {
          setSortBy(option);
        }}
        onFilter={(filters: Record<string, string[]>) => {
          // Reset all filters first
          setSelectedSizes([]);
          setSelectedColors([]);
          setSelectedBrands([]);
          setSelectedPriceRange(null);
          setRatingFilter('all');
          setMinDiscount(0);

          if (filters['Size & Fit']) setSelectedSizes(filters['Size & Fit']);
          if (filters['Colors']) setSelectedColors(filters['Colors']);
          if (filters['Brands']) setSelectedBrands(filters['Brands']);
          if (filters['Ratings']) {
            const rating = filters['Ratings'][0]?.split(' ')[0]; // e.g. "4 Stars & Up" → "4"
            if (rating) setRatingFilter(rating);
          }
          if (filters['Price']) {
            setSelectedPriceRange(filters['Price'][0]);
          }
          if (filters['Category'] && filters['Category'].length > 0) {
            const categoryId = filters['Category'][0]; // already the ID
            // console.log('category id:', categoryId);
            setSelectedCategoryId(Number(categoryId));
          }

          // console.log('Applied :', filters);
        }}
      />
    </SafeAreaView>
  );
};

export default ProductsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  productsList: {
    padding: 16,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
