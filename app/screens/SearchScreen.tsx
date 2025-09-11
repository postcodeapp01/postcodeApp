import React, { useEffect, useMemo, useState, useRef } from 'react';
import { 
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation, useRoute } from '@react-navigation/native';
import axiosInstance from '../../config/Api';
import SearchOverlay from '../components/Search/SearchOverlay';

interface ProductSearchResult {
  product_id: number;
  title: string;
  image: string | null;
  price: number;
  store_name: string;
}

interface StoreSearchResult {
  store_id: number;
  name: string;
  logo_url: string;
  city: string;
}

interface CategorySearchResult {
  id: number;
  name: string;
  image: string | null;
}

interface FproductSearchResult {
  id: number;
  title: string;
  image: string | null;
  price: number;
}

interface RecentSearchItem {
  id: number;
  search_term: string;
}

const PLACEHOLDER_URI = 'https://via.placeholder.com/64';
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const formatImageUrl = (url: string | null | undefined): string => {
  if (!url) return PLACEHOLDER_URI;

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  try {
    const base = axiosInstance?.defaults?.baseURL ?? '';
    const u = new URL(base);
    const origin = `${u.protocol}//${u.host}`;

    if (url.startsWith('/')) {
      return `${origin}${url}`;
    }
    return `${origin}/${url}`;
  } catch {
    return PLACEHOLDER_URI;
  }
};

const SearchScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const initialQuery: string = (route?.params?.q as string) || '';
  const searchInputRef = useRef<TextInput>(null);

  const [searchInputValue, setSearchInputValue] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<{
    stores: StoreSearchResult[];
    products: ProductSearchResult[];
    categories: CategorySearchResult[];
    fproducts: FproductSearchResult[];
  } | null>(null);

  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const [overlayHeight] = useState(new Animated.Value(0));
  
  const [recentSearches, setRecentSearches] = useState<{
    stores: RecentSearchItem[];
    products: RecentSearchItem[];
  }>({ stores: [], products: [] });

  const hasResults = useMemo(() => {
    if (!searchResults) return false;
    const { stores, products, categories, fproducts } = searchResults;
    return (
      (stores && stores.length > 0) ||
      (products && products.length > 0) ||
      (categories && categories.length > 0) ||
      (fproducts && fproducts.length > 0)
    );
  }, [searchResults]);

  // Fetch search results when the route query changes
  useEffect(() => {
    const executeSearch = async () => {
      if (!initialQuery?.trim()) {
        setSearchResults(null);
        setIsSearching(false);
        return;
      }
      setIsSearching(true);
      setSearchResults(null);
      try {
        const [storesRes, productsRes, categoriesRes, fproductsRes] =
          await Promise.all([
            axiosInstance.get(
              `/search/stores?query=${encodeURIComponent(initialQuery)}`
            ),
            axiosInstance.get(
              `/search/products?query=${encodeURIComponent(initialQuery)}`
            ),
            axiosInstance.get(
              `/search/categories?query=${encodeURIComponent(initialQuery)}`
            ),
            axiosInstance.get(
              `/search/fproducts?query=${encodeURIComponent(initialQuery)}`
            ),
          ]);

        const storesData = storesRes.data || {};
        const productsData = productsRes.data || {};
        const categoriesData = categoriesRes.data || {};
        const fproductsData = fproductsRes.data || {};
        console.log("stores Data",storesData);
        console.log("prducts Data",productsData);
        console.log("categoriesData Data",categoriesData);
        console.log("fproductsData Data",fproductsData);
        setSearchResults({
          stores: storesData.stores || [],
          products: productsData.products || [],
          categories: categoriesData.categories || [],
          fproducts: fproductsData.fproducts || [],
        });
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setIsSearching(false);
      }
    };
    executeSearch();
  }, [initialQuery]);

  // Fetch recent searches on component mount
  useEffect(() => {
    const fetchRecentSearches = async () => {
      try {
        const [storesRes, productsRes] = await Promise.all([
          axiosInstance.get(`/search/recentStores`),
          axiosInstance.get(`/search/recentProducts`),
        ]);
        const storesData = storesRes.data || {};
        const productsData = productsRes.data || {};
        // console.log(storesData.data);
        // console.log(productsData.data)
        setRecentSearches({
          stores: storesData.data || [],
          products: productsData.data || [],
        });
      } catch (error) {
        console.error('Failed to fetch recent searches:', error);
      }
    };
    fetchRecentSearches();
  }, []);

  // Animate overlay
  useEffect(() => {
    Animated.timing(overlayHeight, {
      toValue: isOverlayVisible ? SCREEN_HEIGHT * 0.7 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isOverlayVisible]);

  const handleSearchSubmit = (term?: string) => {
    const q = (term ?? searchInputValue).trim();
    if (!q) return;
    setSearchInputValue(q);
    setOverlayVisible(false);
    searchInputRef.current?.blur();
    navigation.navigate('Search', { q });
  };

  const handleRecentSearchClick = (term: string) => {
    setSearchInputValue(term);
    setOverlayVisible(false);
    searchInputRef.current?.blur();
    navigation.navigate('Search', { q: term });
  };

  const handleSearchInputFocus = () => {
    setOverlayVisible(true);
  };

  const handleSearchInputBlur = () => {
    // Delay hiding overlay to allow for tap interactions
    setTimeout(() => {
      setOverlayVisible(false);
    }, 150);
  };

  const handleOverlayItemSelect = (term: string) => {
    handleRecentSearchClick(term);
  };

  const RecentSearchesView: React.FC = () => {
    return (
      <ScrollView style={styles.recentContainer} showsVerticalScrollIndicator={false}>
        {/* Recently searched stores */}
        {recentSearches.stores.length > 0 && (
          <View style={styles.recentSection}>
            <Text style={styles.recentSectionTitle}>
              Recently searched stores
            </Text>
            <View style={styles.recentChipsContainer}>
              {recentSearches.stores.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.recentChip}
                  onPress={() => handleRecentSearchClick(item.search_term)}
                >
                  <Icon name="clock" size={16} color="#6b7280" />
                  <Text style={styles.recentChipText}>
                    {item.search_term}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Recently searched products */}
        {recentSearches.products.length > 0 && (
          <View style={styles.recentSection}>
            <Text style={styles.recentSectionTitle}>
              Recently searched products
            </Text>
            <View style={styles.recentChipsContainer}>
              {recentSearches.products.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.recentChip}
                  onPress={() => handleRecentSearchClick(item.search_term)}
                >
                  <Icon name="clock" size={16} color="#6b7280" />
                  <Text style={styles.recentChipText}>
                    {item.search_term}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Show message if no recent searches */}
        {recentSearches.stores.length === 0 && recentSearches.products.length === 0 && (
          <View style={styles.noRecentContainer}>
            <Icon name="search" size={48} color="#d1d5db" />
            <Text style={styles.noRecentText}>No recent searches</Text>
            <Text style={styles.noRecentSubText}>
              Start searching to see your recent searches here
            </Text>
          </View>
        )}
      </ScrollView>
    );
  };

  const SearchResultsView: React.FC = () => {
    console.log("Entered int")
    if (isSearching) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#ef4444" />
        </View>
      );
    }

    if (!hasResults) {
      return (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>
            No results found for "{initialQuery}"
          </Text>
          <Text style={styles.noResultsSubText}>
            Please check the spelling or try different keywords.
          </Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
        {/* Stores */}
        {searchResults?.stores?.length > 0 && (
          <View style={styles.resultSection}>
            <Text style={styles.sectionTitle}>Stores</Text>
            {searchResults.stores.map((store) => (
              <TouchableOpacity key={store.store_id} style={styles.listItem}>
                <Image
                  source={{ uri: formatImageUrl(store.logo_url) }}
                  style={styles.storeImage}
                />
                <View>
                  <Text style={styles.boldText}>{store.name}</Text>
                  <Text style={styles.subText}>{store.city}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Categories */}
        {searchResults?.categories?.length > 0 && (
          <View style={styles.resultSection}>
            <Text style={styles.sectionTitle}>Categories</Text>
            {searchResults.categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.listItem}
                onPress={() =>
                  navigation.navigate('Products', {
                    level: 3,
                    ids: category.id,
                  })
                }
              >
                {category.image ? (
                  <Image
                    source={{ uri: formatImageUrl(category.image) }}
                    style={styles.categoryImage}
                  />
                ) : (
                  <View style={styles.placeholderImage}>
                    <Text style={styles.placeholderText}>#</Text>
                  </View>
                )}
                <Text style={styles.boldText}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Products */}
        {searchResults?.products?.length > 0 && (
          <View style={styles.resultSection}>
            <Text style={styles.sectionTitle}>Products</Text>
            {searchResults.products.map((product) => (
              <TouchableOpacity
                key={product.product_id}
                style={styles.listItem}
                onPress={() =>
                  navigation.navigate('ProductDetails', {
                    id: product.product_id,
                  })
                }
              >
                <Image
                  source={{ uri: formatImageUrl(product.image) }}
                  style={styles.productImage}
                />
                <View style={styles.flexGrow}>
                  <Text style={styles.boldText}>{product.title}</Text>
                  <Text style={styles.subText}>{product.store_name}</Text>
                  <Text style={styles.priceText}>${product.price}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Featured Products */}
        {searchResults?.fproducts?.length > 0 && (
          <View style={styles.resultSection}>
            <Text style={styles.sectionTitle}>Featured Products</Text>
            {searchResults.fproducts.map((product) => (
              <TouchableOpacity
                key={product.id}
                style={styles.listItem}
                onPress={() =>
                  navigation.navigate('ProductDetails', {
                    id: product.id,
                  })
                }
              >
                <Image
                  source={{ uri: formatImageUrl(product.image) }}
                  style={styles.productImage}
                />
                <View style={styles.flexGrow}>
                  <Text style={styles.boldText}>{product.title}</Text>
                  <Text style={styles.priceText}>${product.price}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.innerContainer}>
        {/* Header with Search Bar */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="arrow-left" size={20} color="#374151" />
          </TouchableOpacity>
          
          <View style={styles.searchInputContainer}>
            <Icon name="search" size={18} color="#9CA3AF" style={styles.searchIcon} />
            <TextInput
              ref={searchInputRef}
              style={styles.searchInput}
              placeholder="Search stores, products, & more"
              value={searchInputValue}
              onChangeText={setSearchInputValue}
              onFocus={handleSearchInputFocus}
              onBlur={handleSearchInputBlur}
              returnKeyType="search"
              onSubmitEditing={() => handleSearchSubmit()}
            />
            <TouchableOpacity style={styles.cameraButton}>
              <Icon name="camera" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Content Area */}
        <View style={styles.contentContainer}>
          {/* Search Overlay - positioned below search bar */}
          <Animated.View style={[styles.overlayContainer, { height: overlayHeight }]}>
            {isOverlayVisible && (
              <SearchOverlay
                visible={isOverlayVisible}
                searchQuery={searchInputValue}
                onSearchSubmit={handleSearchSubmit}
                onRecentSearchSelect={handleOverlayItemSelect}
                onProductSelect={(productId) => {
                  setOverlayVisible(false);
                  console.log("Product ID:", productId);
                  navigation.navigate('ProductDetails', { id: productId });
                }}
                onCategorySelect={(categoryId) => {
                  setOverlayVisible(false);
                  console.log("Category ID:", categoryId);
                  navigation.navigate('ProductsScreen', { id: categoryId });
                }}
                onStoreSelect={(storeId) => {
                  setOverlayVisible(false);
                  console.log("Store ID:", storeId);
                  navigation.navigate('StoreScreen' );
                }}
              />
            )}
          </Animated.View>

          {/* Main Content - only visible when overlay is not shown */}
          {!isOverlayVisible && (
            <View style={styles.mainContent}>
              {initialQuery?.trim() ? <SearchResultsView /> : <RecentSearchesView />}
            </View>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  innerContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    padding: 0,
  },
  cameraButton: {
    padding: 4,
    marginLeft: 8,
  },
  contentContainer: {
    flex: 1,
    position: 'relative',
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    zIndex: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  // Recent searches styles
  recentContainer: {
    flex: 1,
  },
  recentSection: {
    marginBottom: 24,
  },
  recentSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1f2937',
  },
  recentChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  recentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 50,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  recentChipText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#374151',
  },
  noRecentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  noRecentText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 16,
  },
  noRecentSubText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 40,
  },
  // Results styles
  resultsContainer: {
    flex: 1,
  },
  resultSection: {
    marginBottom: 24,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  noResultsContainer: {
    marginTop: 20,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  noResultsText: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  noResultsSubText: {
    color: '#6b7280',
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 12,
    color: '#1f2937',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  storeImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  categoryImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  placeholderImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  placeholderText: {
    color: '#9ca3af',
    fontSize: 18,
  },
  productImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  flexGrow: {
    flex: 1,
  },
  boldText: {
    fontWeight: '600',
    fontSize: 16,
    color: '#1f2937',
  },
  subText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  priceText: {
    fontWeight: 'bold',
    marginTop: 4,
    fontSize: 15,
    color: '#059669',
  },
});
