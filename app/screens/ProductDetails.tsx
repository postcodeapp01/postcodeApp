import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Text,
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
import axios from 'axios';
import {domainUrl} from '../../config/Api';

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

const ProductDetails: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {id} = route.params as {id: string};
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Lime Green');
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${domainUrl}/products/${id}`);
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

  const handleAddToCart = () => {
    if (!product) return;
    console.log('Added to Cart:', {
      product: product.name,
      size: selectedSize,
      color: selectedColor,
    });
  };

  const handleBuyNow = () => {
    if (!product) return;
    console.log('Buying Now:', {
      product: product.name,
      size: selectedSize,
      color: selectedColor,
    });
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
          console.log("🔙 Back pressed in ProductDetails");
          console.log("canGoBack:", navigation.canGoBack());

          try {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              console.log("⚠️ No back stack → navigating to HomeScreen");
              navigation.navigate("HomeScreen" as never);
            }
          } catch (err) {
            console.error("❌ Error on back:", err);
          }
        }}
      />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 100}}>
          <ProductImageCarousel images={product.images||[]} />
          <ProductInfo product={product} />
          <SizeSelector
            sizes={product.sizes||[]}
            selectedSize={selectedSize}
            onSelectSize={setSelectedSize}
            sizeDetails={product.sizeDetails}
          />
          <ColorSelector
            colors={product.colors||[]}
            selectedColor={selectedColor}
            onSelectColor={setSelectedColor}
          />
          <TabSwitcher activeTab={activeTab} setActiveTab={setActiveTab} />
          {activeTab === 'details' && (
            <ProductDescription
              title={product.name}
              description={product.description||""}
              details={product.details||[]}
            />
          )}
          {activeTab === 'reviews' && (
            <ReviewsComponent reviews={product.reviewsData||[]} />
          )}
        </ScrollView>
        <ProductActionFooter
          price={product.price}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          onWishlistToggle={() => {}}
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
