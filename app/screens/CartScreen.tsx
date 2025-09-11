import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import TopSteps from '../components/Cart/TopSteps';
import AddressBar from '../components/Cart/AddressBar';
import CartStep from '../components/Cart/CartStep';
import ReviewStep from '../components/Cart/ReviewStep';
import PaymentStep from '../components/Cart/PaymentStep';
import EmptyCart from '../components/Cart/EmptyCart';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {HomeStackParamList} from '../../navigators/stacks/HomeStack';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import axiosInstance from '../../config/Api';
import {CartItemType} from '../components/Cart/CartItem';
import PaymentSuccessScreen from '../components/Cart/PaymentSuccessPage';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

export interface CartData {
  items: CartItemType[];
  deliveryAddress: string;
  paymentMethod: string;
  subtotal: number;
  deliveryFee: number;
  gst: number;
  platformFee: number;
  total: number;
}

const CartScreen: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [cartData, setCartData] = useState<CartData>({
    items: [],
    deliveryAddress: 'HOME.... | 10-B-681, Laldarwaza mahankali, Hyderabad...',
    paymentMethod: '',
    subtotal: 0,
    deliveryFee: 0,
    gst: 0,
    platformFee: 8,
    total: 0,
  });

  const navigation = useNavigation<NavigationProp>();

  // Step titles for header
  const stepTitles = ['My Cart', 'Review Order', 'Payment'];

  // Fetch cart data from backend
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get('/cart');
        const items = res.data || [];
        console.log("Items detting from the backend",items)
        // Calculate totals
        const subtotal = items.reduce(
          (acc: number, item: CartItemType) => acc + item.price * item.qty,
          0,
        );
        const deliveryFee = subtotal > 500 ? 0 : 0; // Free delivery above ₹500
        const gst = Math.round(subtotal * 0.18); // 18% GST
        const total = subtotal + deliveryFee
        //  + gst + cartData.platformFee;

        setCartData(prev => ({
          ...prev,
          items,
          subtotal,
          deliveryFee,
          gst,
          total,
        }));
      } catch (err) {
        console.error('Failed to fetch cart:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const updateCartItem = async (
    cartId: string,
    qty: number,
    size?: string,
    colorId?: string,
  ) => {
    try {
      await axiosInstance.put(`/cart/${cartId}`, {
        qty,
        size: size || null,
        colorId: colorId || null,
      });

      // Update state and recalculate totals
      const updatedItems = cartData.items.map(item =>
        item.cartId === cartId
          ? {
              ...item,
              qty,
              size: size || item.size,
              colorId: colorId || item.colorId,
            }
          : item,
      );

      const subtotal = updatedItems.reduce(
        (acc, item) => acc + item.price * item.qty,
        0,
      );
      const deliveryFee = subtotal > 500 ? 0 : 0;
      // const gst = Math.round(subtotal * 0.18);
      const total = subtotal + deliveryFee 
      // + gst + cartData.platformFee;

      setCartData(prev => ({
        ...prev,
        items: updatedItems,
        subtotal,
        deliveryFee,
        // gst,
        total,
      }));
    } catch (err) {
      console.error('Failed to update cart item', err);
    }
  };

  const removeCartItem = async (cartId: string) => {
    try {
      await axiosInstance.delete(`/cart/${cartId}`);

      const updatedItems = cartData.items.filter(
        item => item.cartId !== cartId,
      );
      const subtotal = updatedItems.reduce(
        (acc, item) => acc + item.price * item.qty,
        0,
      );
      const deliveryFee = subtotal > 500 ? 0 : 0;
      // const gst = Math.round(subtotal * 0.18);
      const total = subtotal + deliveryFee 
      //  + cartData.platformFee;

      setCartData(prev => ({
        ...prev,
        items: updatedItems,
        subtotal,
        deliveryFee,
        // gst,
        total,
      }));
    } catch (err) {
      console.error('Failed to remove cart item', err);
    }
  };

  const handleNextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigation.goBack();
    }
  };

  const updateAddress = (newAddress: string) => {
    setCartData(prev => ({...prev, deliveryAddress: newAddress}));
  };

  const updatePaymentMethod = (method: string) => {
    setCartData(prev => ({...prev, paymentMethod: method}));
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator
          size="large"
          color="#FF6B6B"
          style={{marginTop: 50}}
        />
      </SafeAreaView>
    );
  }

  if (cartData.items.length === 0 && currentStep === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <EmptyCart />
      </SafeAreaView>
    );
  }
  // console.log(cartData[0])
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* COMMON HEADER SECTION */}
        <View style={styles.headerSection}>
          {/* Header Row */}
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={handlePrevStep} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={20} color="#000" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>{stepTitles[currentStep]}</Text>

            {currentStep === 0 && (
              <TouchableOpacity style={styles.heartBtn}
              onPress={() => navigation.navigate('WishlistScreen')}
              >
                <AntDesign name="hearto" size={16} color="#000" />
              </TouchableOpacity>
            )}
            {currentStep !== 0 && <View style={styles.heartBtn} />}
          </View>

          {/* Steps Indicator */}
          <TopSteps activeIndex={currentStep} />

          {/* Address Bar */}
          {currentStep === 0 && (
            <AddressBar
              address={cartData.deliveryAddress}
              onChange={updateAddress}
            />
          )}
        </View>

        {/* DYNAMIC CONTENT SECTION */}
        <View style={styles.contentSection}>
          {currentStep === 0 && (
            <CartStep
              cartData={cartData}
              onUpdateItem={updateCartItem}
              onRemoveItem={removeCartItem}
              onNext={handleNextStep}
            />
          )}

          {currentStep === 1 && (
            <ReviewStep cartData={cartData} onNext={handleNextStep} />
          )}

          {currentStep === 2 && (
            <PaymentStep
              cartData={cartData}
              onPaymentMethodChange={updatePaymentMethod}
              onComplete={() => {
                // Handle payment completion
                console.log('Payment completed');
              }}
            />
            // <PaymentSuccessScreen/>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  headerSection: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backBtn: {
    padding: 8,
    width: 40,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    flex: 1,
    lineHeight:20,
    letterSpacing:-0.32,
  },
  heartBtn: {
    padding: 8,
    width: 40,
    alignItems: 'center',
  },
  contentSection: {
    flex: 1,
  },
});
