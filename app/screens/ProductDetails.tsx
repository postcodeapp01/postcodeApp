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

interface Product {
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

  const dummySizeChart = [
    {size: 'XS', bust: 34, waist: 32, hips: 38, length: 38, inseam: 30},
    {size: 'S', bust: 36, waist: 34, hips: 40, length: 38, inseam: 40},
    {size: 'M', bust: 38, waist: 36, hips: 42, length: 38, inseam: 42},
    {size: 'L', bust: 40, waist: 38, hips: 44, length: 38, inseam: 44},
    {size: 'XL', bust: 42, waist: 40, hips: 46, length: 38, inseam: 46},
    {size: 'XXL', bust: 44, waist: 42, hips: 48, length: 38, inseam: 48},
    {size: '3XL', bust: 46, waist: 44, hips: 50, length: 38, inseam: 50},
  ];

  const buildShareUrl = async (productId: string) => {
  // Generate deep link (not web URL)
  return `trendrush://product/${productId}`;
};

const onShare = async () => {
  if (!product) return;
  const deepLink = await buildShareUrl(id);

  // Prepare message — just the product name and deep link
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
    // If product has sizes, open modal first
    if (product.sizes && product.sizes.length > 0) {
      setShowSizeModal(true);
    } else {
      // Directly add to cart if no size selection required
      try {
        await axiosInstance.post('/cart', {
          productId: id,
          qty: 1,
          size: null, // no size for this product
        });
        Alert.alert('Added to cart!');
      } catch (err) {
        console.error('❌ Failed to add to cart', err);
        Alert.alert('Failed to add to cart');
      }
    }
  };

  const confirmAddToCart = async () => {
    if (!tempSelectedSize) {
      Alert.alert('Please select a size');
      return;
    }
    if (!product) return;
    try {
      await axiosInstance.post('/cart', {
        productId: (product as any)._id || id,
        size: tempSelectedSize,
        qty: 1,
        colorId: 1,
      });
      Alert.alert('Added to cart!');
      setSelectedSize(tempSelectedSize);
      setShowSizeModal(false);
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
        <StatusBar barStyle="light-content" />
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
        <StatusBar barStyle="light-content" />
        <View style={styles.loader}>
          <Text style={styles.loadingText}>Product not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={{flex: 1}}>
        <ProductHeader
          title="Max Fashion"
          onBack={() => {
            try {
              if (navigation.canGoBack()) {
                navigation.goBack();
              } else {
                navigation.navigate('HomeScreen' as never);
              }
            } catch (err) {
              console.error('❌ Error on back:', err);
            }
          }}
          onShare={onShare}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 100}}
          removeClippedSubviews={false}
          keyboardShouldPersistTaps="handled">
          <ProductImageCarousel images={product.images || []} />
          <ProductInfo product={product} />
          <SizeSelector
            sizes={product.sizes || []}
            selectedSize={selectedSize}
            onSelectSize={setSelectedSize}
            sizeDetails={product.sizeDetails}
          />
          <ColorSelector
            colors={product.colors || []}
            selectedColor={selectedColor}
            onSelectColor={setSelectedColor}
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
            // ReviewsComponent now renders plain Views (no FlatList) to avoid nested virtualization
            <ReviewsComponent reviews={product.reviewsData || []} />
          )}
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
          onConfirm={confirmAddToCart}
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
