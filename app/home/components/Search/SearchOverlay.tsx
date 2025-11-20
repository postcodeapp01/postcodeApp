import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import axiosInstance from '../../../../config/Api';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../Store';
import {calculateDistance} from '../../../common/utils/distanceCalculator';

interface SearchOverlayProps {
  visible: boolean;
  searchQuery: string;
  onSearchSubmit: (term: string) => void;
  onRecentSearchSelect: (term: string) => void;
  onProductSelect: (productId: number) => void;
  onCategorySelect: (categoryId: number) => void;
  onStoreSelect: (storeId: number) => void;
}

export default function SearchOverlay({
  visible,
  searchQuery,
  onSearchSubmit,
  onRecentSearchSelect,
  onProductSelect,
  onCategorySelect,
  onStoreSelect,
}: SearchOverlayProps) {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any | null>(null);
  const [recentSearches, setRecentSearches] = useState<any[]>([]);
  const [recommendedFeaturedProducts, setRecommendedFeaturedProducts] =
    useState<any[]>([]);
  const userLoc = useSelector(
    (state: RootState) => state.user?.userDetails?.location,
  );

  const userLat =
    userLoc?.lat !== undefined && userLoc?.lat !== null
      ? Number(userLoc.lat)
      : undefined;
  const userLng =
    userLoc?.lng !== undefined && userLoc?.lng !== null
      ? Number(userLoc.lng)
      : undefined;
  useEffect(() => {
    if (!visible) return;

    const fetchInitialData = async () => {
      try {
        const [recentStoresRes, fproductsRes] = await Promise.all([
          axiosInstance.get('/search/recentStores'),
          axiosInstance.get('/search/fproducts'),
        ]);

        setRecentSearches(recentStoresRes.data?.data || []);
        setRecommendedFeaturedProducts(
          fproductsRes?.data?.fproducts?.slice(0, 4) || [],
        );
      } catch (error) {
        console.error('Failed to fetch overlay data:', error);
      }
    };

    fetchInitialData();
  }, [visible]);

  // debounced search
  useEffect(() => {
    if (!visible) return;

    const timer = setTimeout(() => {
      const executeSearch = async () => {
        if (searchQuery.trim() === '') {
          setSearchResults(null);
          setIsSearching(false);
          return;
        }

        setIsSearching(true);
        try {
          const [storesRes, productsRes, categoriesRes, fproductsRes] =
            await Promise.all([
              axiosInstance.get(
                `/search/stores?query=${encodeURIComponent(searchQuery)}`,
              ),
              axiosInstance.get(
                `/search/products?query=${encodeURIComponent(searchQuery)}`,
              ),
              axiosInstance.get(
                `/search/categories?query=${encodeURIComponent(searchQuery)}`,
              ),
              axiosInstance.get(
                `/search/fproducts?query=${encodeURIComponent(searchQuery)}`,
              ),
            ]);
          setSearchResults({
            stores: storesRes.data?.stores?.slice(0, 3) || [],
            products: productsRes.data?.products?.slice(0, 5) || [],
            categories: categoriesRes.data?.categories?.slice(0, 3) || [],
            fproducts: fproductsRes.data?.fproducts?.slice(0, 3) || [],
          });
        } catch (error) {
          console.error('Search failed:', error);
        } finally {
          setIsSearching(false);
        }
      };
      executeSearch();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, visible]);

  const hasResults =
    searchResults &&
    (searchResults.stores?.length > 0 ||
      searchResults.products?.length > 0 ||
      searchResults.categories?.length > 0 ||
      searchResults.fproducts?.length > 0);
  const formatDistance = (meters: number) => {
    if (!Number.isFinite(meters)) return '';
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)} km`;
    }
    return `${Math.round(meters)} m`;
  };
 

  if (!visible) return null;

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled">
      {searchQuery.length === 0 ? (
        <View style={styles.initialContent}>
          {/* Trending searches - can be static for demo */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trending</Text>
            {['trending item 1', 'trending item 2', 'trending item 3'].map(
              (item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.trendingItem}
                  onPress={() => onSearchSubmit(item)}>
                  <Icon name="trending-up" size={16} color="#ef4444" />
                  <Text style={styles.trendingText}>{item}</Text>
                </TouchableOpacity>
              ),
            )}
          </View>
        </View>
      ) : isSearching ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ef4444" />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      ) : !hasResults ? (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsTitle}>
            No results found for "{searchQuery}"
          </Text>
        </View>
      ) : (
        <View style={styles.resultsContent}>
          {/* Search Results */}
          {searchResults.stores.map((store: any) => {
            let distance = '';
            if (
              typeof userLat === 'number' &&
              typeof userLng === 'number' &&
              store.latitude &&
              store.longitude
            ) {
              const storeLat = Number(store.latitude);
              const storeLng = Number(store.longitude);
              if (Number.isFinite(storeLat) && Number.isFinite(storeLng)) {
                const distMeters = calculateDistance(
                  storeLat,
                  storeLng,
                  userLat,
                  userLng,
                );
                distance = formatDistance(distMeters);
              }
            }

            return (
              <TouchableOpacity
                key={store.id}
                onPress={() => onStoreSelect(store.id)}
                style={styles.resultItem}>
                <View style={styles.leftColumn}>
                  {store.logo ? (
                    <Image
                      source={{uri: store.logo}}
                      style={styles.storeResultImage}
                    />
                  ) : (
                    <View
                      style={[styles.storeResultImage, styles.placeholder]}
                    />
                  )}

                  {distance ? (
                    <Text style={styles.distanceText}>{distance}</Text>
                  ) : null}
                </View>

                <View style={styles.resultItemContent}>
                  <Text style={styles.resultItemTitle}>{store.name}</Text>
                  <Text style={styles.resultItemSubtitle}>
                    {store.location}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}

          {searchResults?.categories?.length > 0 && (
            <View style={styles.resultSection}>
              <Text style={styles.resultSectionTitle}>Categories</Text>
              {searchResults.categories.map((category: any) => (
                <TouchableOpacity
                  key={category.id}
                  style={styles.resultItem}
                  onPress={() => onCategorySelect(category.id)}>
                  {category.image ? (
                    <Image
                      source={{uri: category.image}}
                      style={styles.categoryResultImage}
                    />
                  ) : (
                    <View style={styles.categoryPlaceholder}>
                      <Icon name="tag" size={20} color="#9ca3af" />
                    </View>
                  )}
                  <View style={styles.resultItemContent}>
                    <Text style={styles.resultItemTitle}>{category.name}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {searchResults?.products?.length > 0 && (
            <View style={styles.resultSection}>
              <Text style={styles.resultSectionTitle}>Products</Text>
              {searchResults.fproducts.map((product: any) => (
                <TouchableOpacity
                  key={product.product_id}
                  style={styles.resultItem}
                  onPress={() => {
                    // console.log('product', product);
                    onProductSelect(product.id);
                  }}>
                  <Image
                    source={{uri: product.image}}
                    style={styles.productResultImage}
                  />
                  <View style={styles.resultItemContent}>
                    <Text style={styles.resultItemTitle}>{product.name}</Text>
                    <Text style={styles.resultItemSubtitle}>
                      {product.store_name}
                    </Text>
                    <Text style={styles.resultItemPrice}>${product.price}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  initialContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1f2937',
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  recentText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: '#374151',
  },
  deleteButton: {
    padding: 4,
  },
  trendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  trendingText: {
    marginLeft: 12,
    fontSize: 15,
    color: '#374151',
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  productImage: {
    width: '100%',
    height: 80,
    borderRadius: 6,
    marginBottom: 8,
  },
  productTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#059669',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  noResultsContainer: {
    padding: 40,
    alignItems: 'center',
  },
  noResultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
  },
  resultsContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resultSection: {
    marginBottom: 16,
  },
  resultSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#6b7280',
    textTransform: 'uppercase',
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD',
  },
  leftColumn: {
    width: 64,
    alignItems: 'center',
    marginRight: 12,
  },
  storeResultImage: {
    width: 40,
    height: 30,
    marginRight: 12,
    padding: 0,
  },
  placeholder: {
    backgroundColor: '#f0f0f0',
  },

  distanceText: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '500',
    color: '#000', // near-black
  },
  categoryResultImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  categoryPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  productResultImage: {
    width: 48,
    height: 48,
    borderRadius: 6,
    marginRight: 12,
  },
  resultItemContent: {
    flex: 1,
  },
  resultItemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  resultItemSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 2,
  },
  resultItemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#059669',
  },
});
