import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Text,
  Alert,
  Share,
} from 'react-native';
import ProductImageCarousel from '../components/ProductDetails/ProductImageCarousel';
import ProductInfo from '../components/ProductDetails/ProductInfo';
import SizeSelector from '../components/ProductDetails/SizeSelector';
import ColorSelector from '../components/ProductDetails/ColorSelector';
import TabSwitcher from '../components/ProductDetails/TabSwitcher';
import ProductDescription from '../components/ProductDetails/ProductDescription';
import ReviewsComponent from '../components/ProductDetails/Reviews';
import ProductActionFooter from '../components/ProductDetails/ProductActionFooter';
import {useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import AddToCartModal from '../components/ProductDetails/AddToCartModal';
import {useDispatch} from 'react-redux';
import StoreProducts from '../components/Cart/StoreProducts';
import ProductsHeader from '../components/Products/ProductsHeader';
import { addItemToCart } from '../../../reduxSlices/cartSlice';
import axiosInstance from '../../../config/Api';

type RouteParams = {
  id: string;
};

type BrandObj = {id?: number; name?: string; logo?: string | null};
type ColorObj = {name: string; image?: string | null};

export type Product = {
  id?: number;
  brand: BrandObj;
  name: string;
  rating: number;
  price: number;
  oldPrice: number;
  discount: number;
  reviews: number;
  sizes: string[];
  colors: ColorObj[];
  images: string[];
  details: string[];
  description: string;
  sizeDetails?: string;
  store: {id?: number; name?: string; location?: string};
  reviewsData: {
    id: string;
    name: string;
    date: string;
    rating: number;
    avatar?: string;
    text?: string;
    images?: string[];
  }[];
};

const ProductDetails: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const {id} = (route.params || {}) as RouteParams;
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [tempSelectedSize, setTempSelectedSize] = useState<string | null>(null);
  const dispatch = useDispatch();

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/products/${id}`);

      const productData = response.data;
      console.log('product details', productData);
      if (!Array.isArray(productData.sizes)) {
        productData.sizes = [];
      }

      if (!Array.isArray(productData.colors)) {
        productData.colors = [];
      }

      if (!Array.isArray(productData.images)) {
        productData.images = [];
      }

      if (!Array.isArray(productData.details)) {
        productData.details = [];
      }

      if (!Array.isArray(productData.reviewsData)) {
        productData.reviewsData = [];
      }

      if (!productData.store || typeof productData.store !== 'object') {
        productData.store = {id: null, name: 'Unknown Store', location: ''};
      }

      if (!productData.brand || typeof productData.brand !== 'object') {
        productData.brand = {id: null, name: 'Unknown Brand', logo: null};
      }

      setProduct(productData);

      if (productData.sizes && productData.sizes.length > 0) {
        setSelectedSize(productData.sizes[0]);
        setTempSelectedSize(productData.sizes[0]);
      }

      if (productData.colors && productData.colors.length > 0) {
        setSelectedColor(productData.colors[0]?.name ?? null);
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
      Alert.alert('Error', 'Failed to load product details');
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  const buildShareUrl = async (productId: string) => {
    return `trendrush://product/${productId}`;
  };

  const onShare = async () => {
    if (!product) return;
    try {
      const deepLink = await buildShareUrl(String(product.id ?? id));
      const message = `Check out ${product.name}\n${deepLink}`;
      await Share.share({
        message,
        url: deepLink,
        title: product.name,
      });
    } catch (err: any) {
      if (err?.message !== 'User did not share') {
        console.error('Share error', err);
      }
    }
  };

  const handleAddToCart = () => {
    if (!product) {
      Alert.alert('Error', 'Product not found');
      return;
    }

    if (Array.isArray(product.sizes) && product.sizes.length > 0) {
      setShowSizeModal(true);
      return;
    }

    addToCart(product.id, null);
  };

  const addToCart = async (
    productId: number | string | undefined,
    size: string | null,
  ) => {
    if (!productId) {
      Alert.alert('Error', 'Invalid product');
      return;
    }

    try {
      const payload = {productId, qty: 1, size, colorId: null};
      const resultAction = (await dispatch(
        addItemToCart(payload) as any,
      )) as any;

      if (resultAction?.error) {
        throw new Error(resultAction.error?.message || 'Failed to add to cart');
      }

      Alert.alert('Success', 'Added to cart!');
      setShowSizeModal(false);
      navigation.goBack();
    } catch (err: any) {
      console.error('Add to cart failed', err);
      Alert.alert('Error', err?.message || 'Failed to add to cart');
    }
  };

  const confirmAddToCart = async () => {
    if (!tempSelectedSize) {
      Alert.alert('Please select a size');
      return;
    }
    await addToCart(product?.id, tempSelectedSize);
    setSelectedSize(tempSelectedSize);
  };

  const handleWishlistToggle = async () => {
    if (!product) {
      Alert.alert('Error', 'Product not found');
      return;
    }

    try {
      const productId = String(product.id);
      await axiosInstance.post(`/wishlist/`, {productId});
      Alert.alert('Success', 'Added to wishlist!');
    } catch (error: any) {
      console.error('Wishlist toggle error', error);
      Alert.alert('Error', 'Failed to add to wishlist');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#FF6B7A" />
          <Text style={styles.loadingText}>Loading product...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loader}>
          <Text style={styles.loadingText}>Product not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Ensure arrays are always arrays before rendering
  const productImages = Array.isArray(product.images) ? product.images : [];
  const productColors = Array.isArray(product.colors) ? product.colors : [];
  const productSizes = Array.isArray(product.sizes) ? product.sizes : [];
  const productReviews = Array.isArray(product.reviewsData)
    ? product.reviewsData
    : [];
  const productDetails = Array.isArray(product.details) ? product.details : [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={{flex: 1}}>
        <ProductsHeader
          title={product.store?.name ?? 'Store'}
          onBack={() => navigation.goBack()}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 100}}
          removeClippedSubviews={false}
          keyboardShouldPersistTaps="handled">
          {/* Product Images */}
          {productImages.length > 0 && (
            <ProductImageCarousel images={productImages} />
          )}

          {/* Product Info */}
          <ProductInfo product={product} />

          {/* Color Selector */}
          {productColors.length > 0 && (
            <ColorSelector
              colors={productColors}
              selectedColor={selectedColor ?? ''}
              onSelectColor={(c: string) => setSelectedColor(c)}
            />
          )}

          {/* Size Selector */}
          {productSizes.length > 0 && (
            <SizeSelector
              sizes={productSizes}
              selectedSize={selectedSize ?? ''}
              onSelectSize={(s: string) => {
                setSelectedSize(s);
                setTempSelectedSize(s);
              }}
              sizeDetails={product.sizeDetails}
            />
          )}

          {/* Tab Switcher */}
          <TabSwitcher activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Details Tab */}
          {activeTab === 'details' && (
            <ProductDescription
              title={product.name}
              description={product.description || ''}
              details={productDetails}
            />
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && productReviews.length > 0 && (
            <ReviewsComponent reviews={productReviews} />
          )}

          {/* Similar Products */}
          {product.store?.id && (
            <StoreProducts
              storeId={product.store.id}
              title="Similar Products"
            />
          )}
        </ScrollView>

        {/* Action Footer */}
        <ProductActionFooter
          price={product.price}
          onAddToCart={handleAddToCart}
          onWishlistToggle={handleWishlistToggle}
        />

        {/* Size Selection Modal */}
        {productSizes.length > 0 && (
          <AddToCartModal
            visible={showSizeModal}
            sizes={productSizes}
            selectedSize={tempSelectedSize}
            onSelectSize={setTempSelectedSize}
            onConfirm={confirmAddToCart}
            onClose={() => setShowSizeModal(false)}
            sizeChart={[]}
            guideImage={require('../../../sources/images/measure.png')}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});

export default ProductDetails;
