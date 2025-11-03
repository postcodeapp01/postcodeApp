// import React, {useEffect, useState} from 'react';
// import {
//   SafeAreaView,
//   View,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
// } from 'react-native';
// import TopSteps from '../components/Cart/TopSteps';
// import CartStep from '../components/Cart/CartStep';
// import StoreSelectionStep from '../components/Cart/StoreSelectionStep';
// import ReviewStep from '../components/Cart/ReviewStep';
// import PaymentStep from '../components/Cart/PaymentStep';
// import EmptyCart from '../components/Cart/EmptyCart';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import {HomeStackParamList} from '../../navigators/stacks/HomeStack';
// import {NativeStackNavigationProp} from '@react-navigation/native-stack';
// import {useNavigation} from '@react-navigation/native';
// import axiosInstance from '../../config/Api';
// import {CartItemType} from '../components/Cart/CartItem';
// import LocationSelector from '../home/components/LocationSelector';
// import {useSelector} from 'react-redux';
// import {selectDefaultAddress} from '../../reduxSlices/addressesSlice';

// type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

// export interface StoreGroup {
//   store_id: number;
//   store_name: string;
//   items: CartItemType[];
//   subtotal: number;
//   deliveryFee: number;
//   total: number;
//   isCompleted?: boolean;
// }

// export interface CartData {
//   items: CartItemType[];
//   storeGroups: StoreGroup[];
//   deliveryAddressId: string;
//   deliveryAddress: string;
//   paymentMethod: string;
//   subtotal: number;
//   deliveryFee: number;
//   gst: number;
//   platformFee: number;
//   total: number;
//   selectedStoreId: number | null;
// }

// const CartScreen: React.FC = () => {
//   const [currentStep, setCurrentStep] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const defaultAddress = useSelector(selectDefaultAddress);
//   const [cartData, setCartData] = useState<CartData>({
//     items: [],
//     storeGroups: [],
//     deliveryAddressId: defaultAddress?.id || '',
//     deliveryAddress: `${defaultAddress?.label ?? 'Home'} | ${
//       defaultAddress?.addressLine1
//     }, ${defaultAddress?.city}, ${defaultAddress?.state}`,
//     paymentMethod: '',
//     subtotal: 0,
//     deliveryFee: 0,
//     gst: 0,
//     platformFee: 8,
//     total: 0,
//     selectedStoreId: null,
//   });
//   const [cartStores, setCartStores] = useState([]);

//   const navigation = useNavigation<NavigationProp>();
//   const stepTitles = ['My Cart', 'Store Items', 'Review Order', 'Payment'];
//   console.log("cart data",cartData)
//   useEffect(() => {
//     if (defaultAddress) {
//       setCartData(prev => ({
//         ...prev,
//         deliveryAddressId: defaultAddress.id,
//         deliveryAddress: `${defaultAddress.label ?? 'Home'} | ${
//           defaultAddress.addressLine1
//         }, ${defaultAddress.city}, ${defaultAddress.state}`,
//       }));
//     }
//   }, [defaultAddress]);

//   const groupItemsByStore = async (
//     items: CartItemType[],
//   ): Promise<StoreGroup[]> => {
//     const grouped = items.reduce((acc, item) => {
//       const storeId = item.store_id;
//       if (typeof storeId === 'number') {
//         if (!acc[storeId]) {
//           acc[storeId] = {
//             store_id: storeId,
//             store_name: item.brand || `Store ${storeId}`,
//             items: [],
//             subtotal: 0,
//             deliveryFee: 0,
//             total: 0,
//             isCompleted: false,
//             store_latitude: null,
//             store_longitude: null,
//           };
//         }
//         acc[storeId].items.push(item);
//       }
//       return acc;
//     }, {} as Record<number, any>);

//     const storeIds = Object.keys(grouped).map(Number);

//     await Promise.all(
//       storeIds.map(async storeId => {
//         try {
//           const res = await axiosInstance.get(`/stores/details/${storeId}`);
//           const store = res.data;
//           grouped[storeId].store_latitude = parseFloat(store.latitude);
//           grouped[storeId].store_longitude = parseFloat(store.longitude);
//           grouped[storeId].store_name =
//             store.name || grouped[storeId].store_name;
//         } catch (error) {
//           console.warn(`Failed to fetch store ${storeId} details`, error);
//         }
//       }),
//     );

//     Object.values(grouped).forEach((store: any) => {
//       store.subtotal = store.items.reduce(
//         (acc: number, item: CartItemType) =>
//           acc + parseFloat(item.price) * item.qty,
//         0,
//       );
//       store.deliveryFee = store.subtotal > 500 ? 0 : 40;
//       store.total = store.subtotal + store.deliveryFee;
//     });
//     // console.log('groupeed', grouped);
//     return Object.values(grouped);
//   };
//   const fetchCart = async (showLoader = true) => {
//     try {
//       if (showLoader) setLoading(true);
//       else setRefreshing(true);

//       const res = await axiosInstance.get('/cart');
//       const items = res.data || [];
//       // console.log('data from the backend', res.data);

//       const storeGroups = await groupItemsByStore(items); // 👈 now awaits

//       const subtotal = items.reduce(
//         (acc: number, item: CartItemType) =>
//           acc + parseFloat(item.price) * item.qty,
//         0,
//       );
//       const deliveryFee = subtotal > 500 ? 0 : 40 * storeGroups.length;
//       const gst = Math.round(subtotal * 0.18);
//       const total = subtotal + deliveryFee;

//       setCartData(prev => ({
//         ...prev,
//         items,
//         storeGroups,
//         subtotal,
//         deliveryFee,
//         gst,
//         total,
//       }));
//     } catch (err) {
//       console.error('Failed to fetch cart:', err);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     fetchCart();
//   }, []);

//   const updateCartItem = async (
//     cartId: string,
//     qty: number,
//     size?: string,
//     colorId?: string,
//   ) => {
//     try {
//       await axiosInstance.put(`/cart/${cartId}`, {
//         qty,
//         size: size || null,
//         colorId: colorId || null,
//       });
//       const updatedItems = cartData.items.map(item =>
//         item.cartId === cartId
//           ? {
//               ...item,
//               qty,
//               size: size || item.size,
//               colorId: colorId || item.colorId,
//             }
//           : item,
//       );
//       const updatedStoreGroups = await groupItemsByStore(updatedItems);

//       const subtotal = updatedItems.reduce(
//         (acc, item) => acc + parseFloat(item.price) * item.qty,
//         0,
//       );
//       const deliveryFee = subtotal > 500 ? 0 : 40 * updatedStoreGroups.length;
//       const total = subtotal + deliveryFee;

//       setCartData(prev => ({
//         ...prev,
//         items: updatedItems,
//         storeGroups: updatedStoreGroups,
//         subtotal,
//         deliveryFee,
//         total,
//       }));
//     } catch (err) {
//       console.error('Failed to update cart item', err);
//       fetchCart(false);
//     }
//   };

//   const confirmRemoval = (message: string) => {
//     return new Promise<'cancel' | 'remove' | 'remove_and_wishlist'>(resolve => {
//       Alert.alert(
//         'Remove from Cart',
//         message,
//         [
//           {
//             text: 'Cancel',
//             style: 'cancel',
//             onPress: () => resolve('cancel'),
//           },
//           {
//             text: 'No',
//             onPress: () => resolve('remove'),
//           },
//           {
//             text: 'Yes, add to wishlist',
//             style: 'default',
//             onPress: () => resolve('remove_and_wishlist'),
//           },
//         ],
//         {cancelable: true},
//       );
//     });
//   };

//   const removeCartItem = async (cartId: string, productId?: string) => {
//     try {
//       const choice = await confirmRemoval(
//         'Do you want to add this item to your wishlist after removing it from cart?',
//       );

//       if (choice === 'cancel') {
//         return false;
//       }
//       await axiosInstance.delete(`/cart/${cartId}`);

//       await fetchCart(false);
//       if (choice === 'remove_and_wishlist' && productId) {
//         try {
//           const res = await axiosInstance.post('/wishlist', {productId});

//           if (
//             res.data?.success === false &&
//             res.data?.message === 'Product already in wishlist'
//           ) {
//             Alert.alert('Wishlist', 'Item already in wishlist.');
//             return;
//           }

//           if (res.data?.success) {
//             Alert.alert('Success', 'Item added to wishlist.');
//           } else {
//             Alert.alert(
//               'Note',
//               res.data?.message || 'Unexpected response from server.',
//             );
//           }
//         } catch (wErr: any) {
//           console.warn('Failed to add to wishlist', wErr);
//           Alert.alert(
//             'Note',
//             'Item removed from cart but failed to add to wishlist.',
//           );
//         }
//       }
//       return true;
//     } catch (err) {
//       console.error('Failed to remove item:', err);
//       try {
//         await fetchCart(false);
//       } catch (_) {}
//       Alert.alert('Error', 'Failed to remove item. Please try again.');
//       throw err; // or return false if you prefer
//     }
//   };
//   const handleItemAdded = async (newItem: any) => {
//     try {
//       const updatedItems = [...cartData.items, newItem];
//       const updatedStoreGroups = await groupItemsByStore(updatedItems);

//       const subtotal = updatedItems.reduce(
//         (acc, item) => acc + parseFloat(item.price) * item.qty,
//         0,
//       );
//       const deliveryFee = subtotal > 500 ? 0 : 40 * updatedStoreGroups.length;
//       const total = subtotal + deliveryFee;

//       setCartData(prev => ({
//         ...prev,
//         items: updatedItems,
//         storeGroups: updatedStoreGroups,
//         subtotal,
//         deliveryFee,
//         total,
//       }));

//       setTimeout(() => fetchCart(false), 500);
//     } catch (err) {
//       console.error('Error handling item addition:', err);
//       fetchCart(false);
//     }
//   };
//   const handleStoreSelect = (storeId: number) => {
//     setCartData(prev => ({...prev, selectedStoreId: storeId}));
//     setCurrentStep(1);
//   };

//   const handleNextStep = () => {
//     if (currentStep < 3) {
//       setCurrentStep(currentStep + 1);
//     }
//   };

//   const handlePrevStep = () => {
//     if (currentStep > 0) {
//       if (currentStep === 1) {
//         setCartData(prev => ({...prev, selectedStoreId: null}));
//         setCurrentStep(0);
//       } else {
//         setCurrentStep(currentStep - 1);
//       }
//     } else {
//       navigation.goBack();
//     }
//   };

//   const handleOrderCompletion = () => {
//     const updatedStoreGroups = cartData.storeGroups.map(store =>
//       store.store_id === cartData.selectedStoreId
//         ? {...store, isCompleted: true}
//         : store,
//     );

//     const remainingItems = cartData.items.filter(
//       item => item.store_id !== cartData.selectedStoreId,
//     );

//     setCartData(prev => ({
//       ...prev,
//       items: remainingItems,
//       storeGroups: updatedStoreGroups.filter(store => !store.isCompleted),
//       selectedStoreId: null,
//     }));

//     if (remainingItems.length > 0) {
//       Alert.alert(
//         'Order Placed Successfully!',
//         'You have items from other stores. Continue shopping?',
//         [
//           {
//             text: 'Exit',
//             onPress: () => navigation.goBack(),
//           },
//           {
//             text: 'Continue Shopping',
//             onPress: () => setCurrentStep(0),
//           },
//         ],
//       );
//     } else {
//       Alert.alert('All Orders Placed Successfully!', '', [
//         {text: 'OK', onPress: () => navigation.goBack()},
//       ]);
//     }
//   };

//   const updatePaymentMethod = (method: string) => {
//     setCartData(prev => ({...prev, paymentMethod: method}));
//   };

//   if (loading) {
//     return (
//       <SafeAreaView style={styles.safe}>
//         <ActivityIndicator
//           size="large"
//           color="#FF6B6B"
//           style={{marginTop: 50}}
//         />
//       </SafeAreaView>
//     );
//   }

//   const currentStore = cartData.selectedStoreId
//     ? cartData.storeGroups.find(
//         store => store.store_id === cartData.selectedStoreId,
//       )
//     : null;

//   return (
//     <SafeAreaView style={styles.safe}>
//       <View style={styles.container}>
//         <View style={styles.headerSection}>
//           <View style={styles.headerRow}>
//             <TouchableOpacity onPress={handlePrevStep} style={styles.backBtn}>
//               <Ionicons name="arrow-back" size={20} color="#000" />
//             </TouchableOpacity>

//             <Text style={styles.headerTitle}>{stepTitles[currentStep]}</Text>

//             {currentStep === 0 && (
//               <TouchableOpacity
//                 style={styles.heartBtn}
//                 onPress={() => navigation.navigate('WishlistScreen')}>
//                 <AntDesign name="hearto" size={16} color="#000" />
//               </TouchableOpacity>
//             )}
//             {currentStep !== 0 && <View style={styles.heartBtn} />}
//           </View>

//           <TopSteps activeIndex={currentStep} totalSteps={4} />

//           {(currentStep === 0 || currentStep === 1) && <LocationSelector />}
//         </View>

//         <View style={styles.contentSection}>
//           {currentStep === 0 &&
//             (cartData.storeGroups.length === 0 ? (
//               <EmptyCart />
//             ) : (
//               <StoreSelectionStep
//                 storeGroups={cartData.storeGroups}
//                 onStoreSelect={handleStoreSelect}
//               />
//             ))}

//           {currentStep === 1 && currentStore && (
//             <CartStep
//               cartData={{
//                 ...cartData,
//                 items: currentStore.items,
//                 subtotal: currentStore.subtotal,
//                 deliveryFee: currentStore.deliveryFee,
//                 total: currentStore.total,
//               }}
//               storeId={currentStore.store_id}
//               storeName={currentStore.store_name}
//               onUpdateItem={updateCartItem}
//               onItemAdded={handleItemAdded}
//               onRemoveItem={removeCartItem}
//               onStoresChange={setCartStores}
//               onNext={handleNextStep}
//               refreshing={refreshing}
//             />
//           )}

//           {currentStep === 2 && currentStore && (
//             <ReviewStep
//               storeGroups={cartStores}
//               onNext={handleNextStep}
//             />
//           )}

//           {currentStep === 3 && currentStore && (
//             <PaymentStep
//               storeGroups={cartStores}
//               onPaymentMethodChange={updatePaymentMethod}
//               onComplete={handleOrderCompletion}
//             />
//           )}
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safe: {
//     flex: 1,
//     backgroundColor: '#FFF',
//   },
//   container: {
//     flex: 1,
//   },
//   headerSection: {
//     backgroundColor: '#FFF',
//     paddingBottom: 8,
//   },
//   headerRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//   },
//   backBtn: {
//     width: 32,
//     height: 32,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#000',
//   },
//   heartBtn: {
//     width: 32,
//     height: 32,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   contentSection: {
//     flex: 1,
//   },
// });

// export default CartScreen;

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

import TopSteps from '../components/Cart/TopSteps';
import CartStep from '../components/Cart/CartStep';
import StoreSelectionStep from '../components/Cart/StoreSelectionStep';
import ReviewStep from '../components/Cart/ReviewStep';
import PaymentStep from '../components/Cart/PaymentStep';
import EmptyCart from '../components/Cart/EmptyCart';
import LocationSelector from '../home/components/LocationSelector';

import axiosInstance from '../../config/Api';
import {
  fetchCart,
  updateCartItemOnServer,
  removeCartItemOnServer,
  CartItemType,
  StoreGroup,
} from '../../reduxSlices/cartSlice';
import {selectDefaultAddress} from '../../reduxSlices/addressesSlice';
import type {HomeStackParamList} from '../../navigators/stacks/HomeStack';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

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
          {/* {(currentStep === 0 || currentStep === 1) && <LocationSelector />} */}

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
    lineHeight:20,
    letterSpacing:0.1,
    marginLeft:8,
    top:3,
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
