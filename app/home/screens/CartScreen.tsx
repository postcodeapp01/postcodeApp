import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import CartStep from '../components/Cart/CartStep';
import StoreSelectionStep from '../components/Cart/StoreSelectionStep';
import ReviewStep from '../components/Cart/ReviewStep';
import PaymentStep from '../components/Cart/PaymentStep';
import EmptyCart from '../components/Cart/EmptyCart';
import axiosInstance from '../../../config/Api';
import {
  fetchCart,
  updateCartItemOnServer,
  removeCartItemOnServer,
  StoreGroup,
} from '../../../reduxSlices/cartSlice';
import {selectDefaultAddress} from '../../../reduxSlices/addressesSlice';
import type {HomeStackParamList} from '../../../navigators/stacks/HomeStack';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import TopSteps from '../components/Cart/TopSteps';
import LocationSelector from '../homePageComponents/LocationSelector';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const CartScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch();

  const {storeGroups, subtotal, deliveryFee, gst, total, loading} = useSelector(
    (state: any) => state.cart,
  );

  const defaultAddress = useSelector(selectDefaultAddress);

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cartStores, setCartStores] = useState<StoreGroup[]>([]);

  const stepTitles = ['My Cart', 'Checkout', 'Review', 'Payment', 'Track'];

  // --- Load Cart ---
  useEffect(() => {
    dispatch(fetchCart() as any);
  }, [dispatch]);

  // --- Refresh Cart ---
  const handleRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchCart() as any);
    setRefreshing(false);
  };

  // --- Address sync ---
  const deliveryAddress = defaultAddress
    ? `${defaultAddress.label ?? 'Home'} | ${defaultAddress.addressLine1}, ${
        defaultAddress.city
      }, ${defaultAddress.state}`
    : 'Select delivery address';

  // --- Update Item ---
  const handleUpdateItem = async (
    cartId: string,
    qty: number,
    size?: string,
    colorId?: string,
  ) => {
    await dispatch(updateCartItemOnServer({cartId, qty, size, colorId}) as any);
  };

  // --- Remove Item ---
  const handleRemoveItem = async (cartId: string, productId?: string) => {
    const choice = await new Promise<
      'cancel' | 'remove' | 'remove_and_wishlist'
    >(resolve => {
      Alert.alert(
        'Remove from Cart',
        'Do you want to add this item to your wishlist after removing it from cart?',
        [
          {text: 'Cancel', style: 'cancel', onPress: () => resolve('cancel')},
          {text: 'No', onPress: () => resolve('remove')},
          {
            text: 'Yes, add to wishlist',
            onPress: () => resolve('remove_and_wishlist'),
          },
        ],
        {cancelable: true},
      );
    });

    if (choice === 'cancel') return;

    await dispatch(removeCartItemOnServer(cartId) as any);

    if (choice === 'remove_and_wishlist' && productId) {
      try {
        const res = await axiosInstance.post('/wishlist', {productId});
        if (res.data?.success) {
          Alert.alert('Success', 'Item added to wishlist.');
        } else if (res.data?.message === 'Product already in wishlist') {
          Alert.alert('Wishlist', 'Item already in wishlist.');
        } else {
          Alert.alert('Note', res.data?.message ?? 'Unexpected response.');
        }
      } catch (err) {
        console.warn('Failed to add to wishlist', err);
        Alert.alert('Note', 'Item removed but failed to add to wishlist.');
      }
    }
  };

  // --- Step Navigation ---
  const handleStoreSelect = (storeId: number) => {
    setSelectedStoreId(storeId);
    setCurrentStep(1);
  };

  const handleNextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    if (currentStep === 0) {
      navigation.goBack();
    } else if (currentStep === 1) {
      setSelectedStoreId(null);
      setCurrentStep(0);
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleOrderCompletion = () => {
    Alert.alert(
      'Order Placed Successfully!',
      'Do you want to continue shopping?',
      [
        {text: 'Exit', onPress: () => navigation.goBack()},
        {text: 'Continue', onPress: () => setCurrentStep(0)},
      ],
    );
  };

  // --- UI states ---
  if (loading && !refreshing) {
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

  const currentStore = selectedStoreId
    ? storeGroups.find(s => s.store_id === selectedStoreId)
    : null;
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerSection}>
          <View style={styles.headerRow}>
            <View style={styles.leftContainer}>
              <TouchableOpacity onPress={handlePrevStep} style={styles.backBtn}>
                <Ionicons name="arrow-back" size={20} color="#000" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>{stepTitles[currentStep]}</Text>
            </View>

            <TouchableOpacity
              style={styles.heartBtn}
              onPress={() => navigation.navigate('WishlistScreen')}>
              <AntDesign name="hearto" size={18} color="#000" />
            </TouchableOpacity>
          </View>
          {(currentStep === 0 || currentStep === 1) && <LocationSelector />}

          <TopSteps activeIndex={currentStep} totalSteps={4} />
        </View>

        {/* Steps */}
        <View style={styles.contentSection}>
          {currentStep === 0 &&
            (storeGroups.length === 0 ? (
              <EmptyCart />
            ) : (
              <StoreSelectionStep
                storeGroups={storeGroups}
                onStoreSelect={handleStoreSelect}
              />
            ))}

          {currentStep === 1 && currentStore && (
            <CartStep
              cartData={{
                items: currentStore.items,
                subtotal: currentStore.subtotal,
                deliveryFee: currentStore.deliveryFee,
                total: currentStore.total,
                deliveryAddress,
              }}
              storeGroups={storeGroups}
              storeId={currentStore.store_id}
              storeName={currentStore.store_name}
              onUpdateItem={handleUpdateItem}
              onRemoveItem={handleRemoveItem}
              onNext={handleNextStep}
              refreshing={refreshing}
              onRefresh={handleRefresh}
              onStoresChange={setCartStores}
            />
          )}

          {currentStep === 2 && currentStore && (
            <ReviewStep storeGroups={cartStores} onNext={handleNextStep} />
          )}

          {currentStep === 3 && currentStore && (
            <PaymentStep
              storeGroups={cartStores}
              onPaymentMethodChange={setPaymentMethod}
              onComplete={handleOrderCompletion}
            />
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
    elevation: 2,
  },
  headerRow: {
    backgroundColor: '#fff',
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.9,
    shadowRadius: 2,
    elevation: 15,
  },

  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  backBtn: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 5,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#464646',
    lineHeight: 20,
    letterSpacing: 0.1,
    marginLeft: 8,
    top: 3,
  },

  heartBtn: {
    width: 35,
    height: 35,
    borderRadius: 18,
    justifyContent: 'center',
    backgroundColor: '#FFF',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 5,
    marginRight: 5,
  },

  contentSection: {flex: 1},
});
