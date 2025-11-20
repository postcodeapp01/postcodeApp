import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import RecommendedProducts from '../components/Store/RecommendedProducts';
import {useRoute, RouteProp, useNavigation} from '@react-navigation/native';
import {Text} from '@react-navigation/elements';
import ProductsHeader from '../components/Products/ProductsHeader';
import {useDispatch, useSelector} from 'react-redux';
import ProductFilterBar from '../components/Products/ProductFilterBar';
import StoreInfo from '../components/Store/StoreInfo';
import { selectBookmarkUpdating,selectIsBookmarked,
  toggleBookmark, } from '../../../reduxSlices/bookmarkSlice';
import axiosInstance from '../../../config/Api';

type StoreScreenRouteParams = {
  storeId: string;
};

const DEFAULT_SIMILAR_RADIUS = 20000;
const DEFAULT_SIMILAR_LIMIT = 50;
const DEFAULT_SIMILAR_RADIUS_FALLBACK = 1000000;

const StoreScreen: React.FC = () => {
  const route =
    useRoute<RouteProp<{StoreScreen: StoreScreenRouteParams}, 'StoreScreen'>>();
  const initialRouteStoreId = route.params.storeId;
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // main states
  const [storeData, setStoreData] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // filters / pagination
  const [sortBy, setSortBy] = useState('default');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(
    null,
  );
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );

  const [page, setPage] = useState(1);
  const limit = 20;
  const [similarStores, setSimilarStores] = useState<any[]>([]);
  const [similarLoading, setSimilarLoading] = useState(false);
  const [similarError, setSimilarError] = useState<string | null>(null);

  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const isBookmarked = useSelector((state: any) =>
    selectIsBookmarked(state, initialRouteStoreId),
  );
  const updating = useSelector((state: any) =>
    selectBookmarkUpdating(state, initialRouteStoreId),
  );

  const onBookmarkPress = useCallback(() => {
    if (updating) return;
    dispatch(toggleBookmark({storeId: initialRouteStoreId}));
  }, [dispatch, initialRouteStoreId, updating]);

  const buildProductsParams = useMemo(() => {
    return () => {
      const params: Record<string, any> = {
        page,
        limit,
      };
      if (sortBy && sortBy !== 'default') params.sort = sortBy;
      if (selectedBrands.length > 0) params.brands = selectedBrands.join(',');
      if (selectedSizes.length > 0) params.sizes = selectedSizes.join(',');
      if (selectedColors.length > 0) params.colors = selectedColors.join(',');
      if (selectedPriceRange) params.priceRange = selectedPriceRange;
      if (ratingFilter && ratingFilter !== 'all') params.rating = ratingFilter;
      if (selectedCategoryId) params.category = selectedCategoryId;
      return params;
    };
  }, [
    page,
    limit,
    sortBy,
    selectedBrands,
    selectedSizes,
    selectedColors,
    selectedPriceRange,
    ratingFilter,
    selectedCategoryId,
  ]);
  const fetchStoreDetails = useCallback(async (id: string | number) => {
    try {
      setLoading(true);
      const storeRes = await axiosInstance.get(`/stores/details/${id}`);
      if (!isMounted.current) return;
      setStoreData(storeRes.data);
    } catch (err) {
      console.error('Error fetching store details:', err);
      if (!isMounted.current) return;
      setError('Failed to load store details');
    } finally {
      if (!isMounted.current) return;
      setLoading(false);
    }
  }, []);

  const fetchProducts = useCallback(
    async (useStoreId?: string | number, opts?: {append?: boolean}) => {
      const targetStoreId = useStoreId ?? initialRouteStoreId;
      try {
        setProductsLoading(true);
        setError(null);

        const params = buildProductsParams();
        const res = await axiosInstance.get(
          `/stores/${targetStoreId}/products`,
          {params},
        );

        if (!isMounted.current) return;

        const fetched = Array.isArray(res.data.products)
          ? res.data.products
          : res.data;

        if (opts?.append) {
          setProducts(prev => [...prev, ...fetched]);
        } else {
          setProducts(fetched);
        }
      } catch (err) {
        console.error('Error fetching products with filters:', err);
        if (!isMounted.current) return;
        setError('Failed to load products');
      } finally {
        if (!isMounted.current) return;
        setProductsLoading(false);
      }
    },
    [initialRouteStoreId, buildProductsParams],
  );

  const fetchSimilarStores = useCallback(
    async (opts?: {
      id?: string | number;
      storeObj?: any;
      radius?: number;
      limit?: number;
    }) => {
      const id =
        opts?.id ?? opts?.storeObj?.id ?? storeData?.id ?? initialRouteStoreId;
      if (!id) {
        console.warn('fetchSimilarStores: missing id');
        return;
      }

      const radius = opts?.radius ?? DEFAULT_SIMILAR_RADIUS;
      const limitParam = opts?.limit ?? DEFAULT_SIMILAR_LIMIT;

      const source = opts?.storeObj ?? storeData ?? null;
      const payload: Record<string, any> = {};

      if (source?.latitude !== undefined && source?.latitude !== null) {
        const latNum = Number(source.latitude);
        if (!Number.isNaN(latNum)) payload.lat = latNum;
      }
      if (source?.longitude !== undefined && source?.longitude !== null) {
        const lngNum = Number(source.longitude);
        if (!Number.isNaN(lngNum)) payload.lng = lngNum;
      }
      if (source?.name) payload.name = String(source.name);

      setSimilarLoading(true);
      setSimilarError(null);

      try {
        const res = await axiosInstance.post(`/stores/${id}/similar`, payload, {
          params: {
            radius: radius ?? DEFAULT_SIMILAR_RADIUS_FALLBACK,
            limit: limitParam,
          },
        });

        if (!isMounted.current) return;

        const data = res.data || {};
        const rows = data.similarStores ?? [];

        const normalized = (rows as any[]).map(s => {
          const distanceMeters = s.distance != null ? Number(s.distance) : null;
          const distanceKm =
            distanceMeters != null ? distanceMeters / 1000 : null;
          const friendlyDistance =
            distanceKm != null
              ? `${(Math.round(distanceKm * 100) / 100).toFixed(2)} km`
              : null;

          return {
            ...s,
            distance: distanceMeters,
            distanceKm:
              distanceKm != null
                ? (Math.round(distanceKm * 100) / 100).toFixed(2)
                : null,
            distanceMeters:
              distanceMeters != null ? Math.round(distanceMeters) : null,
            friendlyDistance,
          };
        });

        setSimilarStores(normalized);
      } catch (err: any) {
        console.error('fetchSimilarStores error', err);
        if (!isMounted.current) return;
        setSimilarError(
          err?.response?.data?.error ?? err.message ?? 'Unknown error',
        );
      } finally {
        if (!isMounted.current) return;
        setSimilarLoading(false);
      }
    },
    [storeData, initialRouteStoreId],
  );

  useEffect(() => {
    if (!initialRouteStoreId) return;

    let mounted = true;
    (async () => {
      await fetchStoreDetails(initialRouteStoreId);
      if (!mounted) return;
      setPage(1);
      await fetchProducts(initialRouteStoreId);
      if (!mounted) return;
      fetchSimilarStores({
        id: initialRouteStoreId,
        radius: DEFAULT_SIMILAR_RADIUS,
        limit: DEFAULT_SIMILAR_LIMIT,
      });
    })();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialRouteStoreId]);

  useEffect(() => {
    if (!initialRouteStoreId) return;
    fetchProducts(undefined, {append: page > 1});
  }, [
    initialRouteStoreId,
    sortBy,
    JSON.stringify(selectedSizes),
    JSON.stringify(selectedColors),
    JSON.stringify(selectedBrands),
    selectedPriceRange,
    ratingFilter,
    selectedCategoryId,
    page,
  ]);

  const onLocationSelect = useCallback(
    async (location: any) => {
      if (!location || !location.id) return;
      setPage(1);
      setSelectedSizes([]);
      setSelectedColors([]);
      setSelectedBrands([]);
      setSelectedPriceRange(null);
      setRatingFilter('all');
      setSelectedCategoryId(null);
      setProducts([]);
      const newStoreData = {
        id: location.id,
        name: location.name,
        logo: location.logo ?? location.image,
        location: location.address ?? location.location,
        latitude: location.latitude ?? location.lat,
        longitude: location.longitude ?? location.lng,
        rating: location.rating ?? undefined,
        deliveryTime: location.deliveryTime ?? undefined,
        distance: location.friendlyDistance ?? location.distance ?? undefined,
        ratingCount: location.ratingCount ?? undefined,
      };
      setStoreData(newStoreData);
      await fetchProducts(location.id);
      fetchSimilarStores({
        id: location.id,
        storeObj: newStoreData,
        radius: DEFAULT_SIMILAR_RADIUS,
        limit: DEFAULT_SIMILAR_LIMIT,
      });
    },
    [fetchProducts, fetchSimilarStores],
  );

  const onApplyFiltersFromBar = useCallback(
    (filters: Record<string, string[]>) => {
      setPage(1);
      setSelectedSizes([]);
      setSelectedColors([]);
      setSelectedBrands([]);
      setSelectedPriceRange(null);
      setRatingFilter('all');
      setSelectedCategoryId(null);

      if (filters['Size & Fit']) setSelectedSizes(filters['Size & Fit']);
      if (filters['Colors']) setSelectedColors(filters['Colors']);
      if (filters['Brands']) setSelectedBrands(filters['Brands']);
      if (filters['Ratings']) {
        const rating = filters['Ratings'][0]?.split(' ')[0];
        if (rating) setRatingFilter(rating);
      }
      if (filters['Price']) {
        setSelectedPriceRange(filters['Price'][0]);
      }
      if (filters['Category'] && filters['Category'].length > 0) {
        const categoryId = Number(filters['Category'][0]);
        if (!Number.isNaN(categoryId)) setSelectedCategoryId(categoryId);
      }
    },
    [],
  );

  const onSortChange = useCallback((option: string) => {
    setSortBy(option);
    setPage(1);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (!productsLoading) {
      setPage(prev => prev + 1);
    }
  }, [productsLoading]);

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

        <StoreInfo
          similarStores={similarStores}
          store={storeData}
          onLocationSelect={onLocationSelect}
        />

        {productsLoading && (
          <View style={{padding: 12}}>
            <ActivityIndicator size="small" color="#FF6B6B" />
          </View>
        )}

        <RecommendedProducts
          products={products}
          onEndReached={handleLoadMore}
        />
      </ScrollView>

      <ProductFilterBar
        onSort={onSortChange}
        onFilter={onApplyFiltersFromBar}
      />
    </SafeAreaView>
  );
};

export default StoreScreen;

const styles = StyleSheet.create({
  container: {flex: 1},
  scrollView: {flex: 1},
  centered: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});
