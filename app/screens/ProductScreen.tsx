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
import ProductCard from '../components/Store/ProductCard';
import ProductsHeader from '../components/Products/ProductsHeader';
import FilterBar from '../components/Products/FilterBar';
import {getProductsByCategory} from '../components/Products/productsData';
import {HomeStackParamList} from '../../navigators/stacks/HomeStack';
import { domainUrl } from '../../config/Api';
import { setProducts } from '../../reduxSlices/productSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../Store';

type ProductsScreenRouteProp = RouteProp<HomeStackParamList, 'ProductsScreen'>;
type ProductsScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  'ProductsScreen'
>;

interface Product {
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
  const {categoryName, subcategory} = route.params;
  console.log("categories ", categoryName,subcategory);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('default');
  const [filterBy, setFilterBy] = useState('all');
  const dispatch=useDispatch();
  const products=useSelector((state:RootState)=>state.productsData.products);

  useEffect(() => {
    loadProducts();
  }, [categoryName, subcategory, sortBy, filterBy,dispatch]);

  const loadProducts = async () => {
  setLoading(true);
  try {
    const response = await fetch(`${domainUrl}/products`);
    const data = await response.json();

    // If backend sends an array directly
    const productsData = Array.isArray(data) ? data : data.products;

    // Normalize product fields to match the Product interface
    const normalizedProducts = (productsData || [])
      .filter((product: any) => product.category === categoryName && (!subcategory || product.subcategory === subcategory))
      .map((product: any) => ({
        ...product,
        price: String(product.price),
        originalPrice: product.originalPrice !== undefined ? String(product.originalPrice) : undefined,
        rating: String(product.rating),
        id: String(product.id),
      }));
    
    dispatch(setProducts(normalizedProducts));
    setLoading(false);
  } catch (error) {
    console.error('Error loading products:', error);
    setLoading(false);
  }
};


  const applyFiltersAndSort = (productList: Product[]) => {
    let filtered = [...productList];

    // Apply filters
    if (filterBy !== 'all') {
      filtered = filtered.filter(product => {
        switch (filterBy) {
          case 'discount':
            return product.discount && product.originalPrice;
          case 'rating':
            return parseFloat(product.rating) >= 4.0;
          case 'price_low':
            return parseFloat(product.price) <= 1000;
          case 'price_high':
            return parseFloat(product.price) > 1000;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    switch (sortBy) {
      case 'price_low_to_high':
        filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case 'price_high_to_low':
        filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case 'rating':
        filtered.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
        break;
      case 'newest':
        // Assume newer products have higher IDs
        filtered.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
      default:
        break;
    }

    return filtered;
  };

  const renderProduct = ({item, index}: {item: Product; index: number}) => (
    <ProductCard
      product={item}
      isLeftColumn={index % 2 === 0}
      onPress={() => {
        navigation.navigate('ProductDetails',{product: item});
      }}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>No Products Found</Text>
      <Text style={styles.emptySubtitle}>
        We couldn't find any products in {subcategory || categoryName}.
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
        <ProductsHeader
          title={subcategory || categoryName}
          onBack={() => navigation.navigate('HomeScreen')}
        />
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
        title={subcategory || categoryName}
        onBack={() => navigation.navigate('HomeScreen')}
        productCount={products?.length}
      />

      <FilterBar
        sortBy={sortBy}
        filterBy={filterBy}
        onSortChange={setSortBy}
        onFilterChange={setFilterBy}
      />

      <FlatList
        data={applyFiltersAndSort(products)}
        renderItem={renderProduct}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.productsList}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
    </SafeAreaView>
  );
};

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

export default ProductsScreen;


