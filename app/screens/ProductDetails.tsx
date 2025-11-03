import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Text,
  Alert,
  Linking,
  Share,
} from 'react-native';
import ProductHeader from '../components/ProductDetails/ProductHeader';
import ProductImageCarousel from '../components/ProductDetails/ProductImageCarousel';
import ProductInfo from '../components/ProductDetails/ProductInfo';
import SizeSelector from '../components/ProductDetails/SizeSelector';
import ColorSelector from '../components/ProductDetails/ColorSelector';
import TabSwitcher from '../components/ProductDetails/TabSwitcher';
import ProductDescription from '../components/ProductDetails/ProductDescription';
import ReviewsComponent from '../components/ProductDetails/Reviews';
import ProductActionFooter from '../components/ProductDetails/ProductActionFooter';
import {useNavigation, useRoute} from '@react-navigation/native';
import axiosInstance from '../../config/Api';
import {HomeStackParamList} from '../../navigators/stacks/HomeStack';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import AddToCartModal from '../components/ProductDetails/AddToCartModal';
import { useDispatch } from 'react-redux';
import { addItemToCart } from '../../reduxSlices/cartSlice';
import StoreProducts from '../components/Cart/StoreProducts';
import ProductsHeader from '../components/Products/ProductsHeader';

interface Product {
  id?: number;
  brand: string;
  name: string;
  rating: number;
  price: number;
  oldPrice: number;
  discount: number;
  reviews: number;
  sizes: string[];
  colors: {name: string; image: any}[];
  images: string[];
  details: string[];
  description: string;
  sizeDetails?: string;
  storeId?: number;
  reviewsData: {
    id: string;
    name: string;
    date: string;
    rating: number;
    avatar: string;
    text: string;
    images: string[];
  }[];
}
type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const ProductDetails: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation<NavigationProp>();
  

  const {id} = route.params as {id: string};
  console.log('🆔 Extracted Product ID:', id);

  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Lime Green');
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const [isWishlisted, setIsWishlisted] = useState(false);

  const [showSizeModal, setShowSizeModal] = useState(false);
  const [tempSelectedSize, setTempSelectedSize] = useState<string | null>(null);
  const dispatch = useDispatch();
  const dummySizeChart = [
    {size: 'XS', bust: 34, waist: 32, hips: 38, length: 38, inseam: 30},
    {size: 'S', bust: 36, waist: 34, hips: 40, length: 38, inseam: 40},
    {size: 'M', bust: 38, waist: 36, hips: 42, length: 38, inseam: 42},
    {size: 'L', bust: 40, waist: 38, hips: 44, length: 38, inseam: 44},
    {size: 'XL', bust: 42, waist: 40, hips: 46, length: 38, inseam: 46},
    {size: 'XXL', bust: 44, waist: 42, hips: 48, length: 38, inseam: 48},
    {size: '3XL', bust: 46, waist: 44, hips: 50, length: 38, inseam: 50},
  ];


  // Full navigation state
  const state = navigation.getState();
  console.log('Full navigation state:', JSON.stringify(state, null, 2));

  // Current stack's routes
  const routes = state.routes;
  console.log('Stack routes:', routes.map(r => r.name));

  // Get previous route
  const currentIndex = state.index;
  const prevRoute = routes[currentIndex - 1];
  console.log('Previous screen:', prevRoute?.name);

  const buildShareUrl = async (productId: string) => {
  // Generate deep link (not web URL)
  return `trendrush://product/${productId}`;
};

const onShare = async () => {
  if (!product) return;
  const deepLink = await buildShareUrl(id);

  const message = `${product.name}\n${deepLink}`;

  try {
    await Share.share({
      message, // Android: this is shown and clickable
      url: deepLink, // iOS: uses this if available
      title: product.name,
    });
  } catch (err) {
    console.error('Share error', err);
  }
};


  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/products/${id}`);
      console.log("Product details",response.data)
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, []);

  

const handleAddToCart = async () => {
  if (!product) return;
  if (product.sizes && product.sizes.length > 0) {
    setShowSizeModal(true);
    return;
  }

  try {
    const payload = {
      productId: id,
      qty: 1,
      size: null,
    };

    const resultAction = await dispatch(addItemToCart(payload) as any);
    if (resultAction.error) {
      throw new Error(resultAction.error?.message ?? 'Add failed');
    }

    Alert.alert('Added to cart!');
    // navigate back so CartScreen comes into view (it will re-fetch on focus)
    navigation.goBack();
  } catch (err) {
    console.error('❌ Failed to add to cart', err);
    Alert.alert('Failed to add to cart');
  }
};

// for size modal confirm
const confirmAddToCart = async () => {
  if (!tempSelectedSize) {
    Alert.alert('Please select a size');
    return;
  }
  if (!product) return;

  try {
    const payload = {
      productId: (product as any)._id || id,
      qty: 1,
      size: tempSelectedSize,
      colorId: 1,
    };

    const resultAction = await dispatch(addItemToCart(payload) as any);
    if (resultAction.error) {
      throw new Error(resultAction.error?.message ?? 'Add failed');
    }

    Alert.alert('Added to cart!');
    setSelectedSize(tempSelectedSize);
    setShowSizeModal(false);
    navigation.goBack();
  } catch (err) {
    console.error('Failed to add to cart', err);
    Alert.alert('Failed to add to cart');
  }
};



  const handleWishlistToggle = async () => {
    try {
      if (isWishlisted) {
        // remove
        await axiosInstance.delete(`/wishlist/${id}`);
        setIsWishlisted(false);
      } else {
        // add
        await axiosInstance.post(`/wishlist/`, {
          productId: id,
        });
        Alert.alert('Added to wishlist!');
        setIsWishlisted(true);
      }
    } catch (error) {
      console.error('Wishlist toggle error', error);
    }
  };
  const handleBuyNow = () => {
    navigation.navigate('BuyNowScreen', {id} as never);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#000" />
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
  console.log("product un detail",product)
  return (
    <SafeAreaView style={styles.container}>
      <View style={{flex: 1}}>
        <ProductsHeader title={product.store.name} onBack={()=>navigation.goBack()}/>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 100}}
          removeClippedSubviews={false}
          keyboardShouldPersistTaps="handled">
          <ProductImageCarousel images={product.images || []} />
          <ProductInfo product={product} />
          <ColorSelector
            colors={product.colors || []}
            selectedColor={selectedColor}
            onSelectColor={setSelectedColor}
          />
          <SizeSelector
            sizes={product.sizes || []}
            selectedSize={selectedSize}
            onSelectSize={setSelectedSize}
            sizeDetails={product.sizeDetails}
          />
          
          <TabSwitcher activeTab={activeTab} setActiveTab={setActiveTab} />
          {activeTab === 'details' && (
            <ProductDescription
              title={product.name}
              description={product.description || ''}
              details={product.details || []}
            />
          )}
          {activeTab === 'reviews' && (
            <ReviewsComponent reviews={product.reviewsData || []} />
          )}
          <StoreProducts storeId={product.store.id} title="Similar Products" />
        </ScrollView>
        <ProductActionFooter
          price={product.price}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          onWishlistToggle={handleWishlistToggle}
        />

        <AddToCartModal
          visible={showSizeModal}
          sizes={product.sizes || []}
          selectedSize={tempSelectedSize}
          onSelectSize={setTempSelectedSize}
          // onConfirm={confirmAddToCart}
          onConfirm={() => confirmAddToCart(tempSelectedSize)} 
          onClose={() => setShowSizeModal(false)}
          sizeChart={
            dummySizeChart /* array of SizeRow objects from backend (cm) */
          }
          guideImage={require('../../sources/images/measure.png')}
        />
      </View>
    </SafeAreaView>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
});
