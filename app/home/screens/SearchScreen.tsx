import React, {useEffect, useMemo, useState, useRef} from 'react';
import {
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
import {useNavigation, useRoute} from '@react-navigation/native';
import axiosInstance from '../../../config/Api';
import SearchOverlay from '../components/Search/SearchOverlay';



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

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

const SearchScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const initialQuery: string = (route?.params?.q as string) || '';
  const searchInputRef = useRef<TextInput>(null);

  const [searchInputValue, setSearchInputValue] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<{
    stores: StoreSearchResult[];
    // products: ProductSearchResult[];
    categories: CategorySearchResult[];
    fproducts: FproductSearchResult[];
  } | null>(null);

  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const [overlayHeight] = useState(new Animated.Value(0));

  const [recentSearches, setRecentSearches] = useState<{
    stores: RecentSearchItem[];
    products: RecentSearchItem[];
  }>({stores: [], products: []});

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
        // , productsRes
        const [storesRes, categoriesRes, fproductsRes] = await Promise.all([
          axiosInstance.get(
            `/search/stores?query=${encodeURIComponent(initialQuery)}`,
          ),
          // axiosInstance.get(
          //   `/search/products?query=${encodeURIComponent(initialQuery)}`
          // ),
          axiosInstance.get(
            `/search/categories?query=${encodeURIComponent(initialQuery)}`,
          ),
          axiosInstance.get(
            `/search/fproducts?query=${encodeURIComponent(initialQuery)}`,
          ),
        ]);

        const storesData = storesRes.data || {};
        // const productsData = productsRes.data || {};
        const categoriesData = categoriesRes.data || {};
        const fproductsData = fproductsRes.data || {};
        console.log('stores Data', storesData);
        // console.log("prducts Data",productsData);
        console.log('categoriesData Data', categoriesData);
        console.log('fproductsData Data', fproductsData);
        // products: productsData.products || [],
        setSearchResults({
          stores: storesData.stores || [],
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
    navigation.navigate('Search', {q});
  };

  const handleRecentSearchClick = (term: string) => {
    setSearchInputValue(term);
    setOverlayVisible(false);
    searchInputRef.current?.blur();
    navigation.navigate('Search', {q: term});
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
      <ScrollView
        style={styles.recentContainer}
        showsVerticalScrollIndicator={false}>
        {/* Recently searched stores */}
        {recentSearches.stores.length > 0 && (
          <View style={styles.recentSection}>
            <Text style={styles.recentSectionTitle}>Recent searches</Text>
            <View style={styles.recentChipsContainer}>
              {recentSearches.stores.map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.recentChip}
                  onPress={() => handleRecentSearchClick(item.search_term)}>
                  <Icon name="clock" size={16} color="#6b7280" />
                  <Text style={styles.recentChipText}>{item.search_term}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Show message if no recent searches */}
        {recentSearches.stores.length === 0 &&
          recentSearches.products.length === 0 && (
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

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.innerContainer}>
        {/* Header with Search Bar */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <View style={styles.circleButton}>
              <Icon name="chevron-left" size={20} color="#374151" />
            </View>
          </TouchableOpacity>

          <View style={styles.searchInputContainer}>
            <Icon
              name="search"
              size={18}
              color="#9CA3AF"
              style={styles.searchIcon}
            />
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
          </View>
        </View>

        {/* Main Content Area */}
        <View style={styles.contentContainer}>
          {/* Search Overlay - positioned below search bar */}
          <Animated.View
            style={[styles.overlayContainer, {height: overlayHeight}]}>
            {isOverlayVisible && (
              <SearchOverlay
                visible={isOverlayVisible}
                searchQuery={searchInputValue}
                onSearchSubmit={handleSearchSubmit}
                onRecentSearchSelect={handleOverlayItemSelect}
                onProductSelect={productId => {
                  setOverlayVisible(false);
                  console.log('Product ID:', productId);
                  navigation.navigate('ProductDetails', {id: productId});
                }}
                onCategorySelect={categoryId => {
                  setOverlayVisible(false);
                  console.log('Category ID:', categoryId);
                  navigation.navigate('ProductsScreen', {id: categoryId});
                }}
                onStoreSelect={storeId => {
                  setOverlayVisible(false);
                  console.log('Store ID:', storeId);
                  navigation.navigate('StoreScreen', {storeId});
                }}
              />
            )}
          </Animated.View>

          {/* Main Content - only visible when overlay is not shown */}
          {!isOverlayVisible && (
            <View style={styles.mainContent}>
              {!initialQuery?.trim() && <RecentSearchesView />}
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
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 4,
    marginRight: 4,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 8,
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
    shadowOffset: {width: 0, height: 1},
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
});
