import React, {useMemo, useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CartSummary from './CartSummary';
import axiosInstance from '../../../../config/Api';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import RazorpayCheckout from 'react-native-razorpay';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../Store';
import {selectDefaultAddress} from '../../../../reduxSlices/addressesSlice';
interface PaymentStepProps {
  storeGroups: any[];
  onPaymentMethodChange: (method: string) => void;
  onComplete: () => void;
}

const PaymentStep: React.FC<PaymentStepProps> = ({
  storeGroups = [],
  onPaymentMethodChange,
  onComplete,
}) => {
  const navigation = useNavigation();
  const [selectedPayment, setSelectedPayment] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [netBank, setNetBank] = useState('');
  const user = useSelector((state: RootState) => state.user?.userDetails);
  const shippingAddress = useSelector(selectDefaultAddress);
  // console.log('shippingAddress', shippingAddress);
  const paymentMethods = [
    {id: 'card', label: 'Credit / Debit / ATM Card', icon: 'credit-card'},
    {id: 'netbanking', label: 'Net Banking', icon: 'account-balance'},
    {id: 'upi', label: 'UPI', icon: 'payment'},
    {id: 'cod', label: 'Cash on Delivery', icon: 'local-shipping'},
  ];
  const allItems = useMemo(
    () => storeGroups.flatMap(store => store.items || []),
    [storeGroups],
  );
  const subtotal = allItems.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (item.qty || 1),
    0,
  );
  const deliveryFee = storeGroups.reduce(
    (sum, store) => sum + (store.deliveryFee || 0),
    0,
  );
  const gst = subtotal * 0.05; // or replace with real logic
  const platformFee = 20; // optional
  const total = subtotal + deliveryFee + gst + platformFee;
  const handlePaymentSelect = (methodId: string) => {
    setSelectedPayment(methodId);
    onPaymentMethodChange(methodId);
  };

  //successfully works with the mangodb only the payment
  // const handleProceed = async () => {
  //   if (!selectedPayment) {
  //     Alert.alert('Select payment', 'Please select a payment method');
  //     return;
  //   }

  //   try {

  //     setIsProcessing(true);
  //     const items = (allItems || []).map((it: any) => ({
  //       product_id: it.productId,
  //       product_name: it.name,
  //       quantity: it.qty,
  //       price: Number(it.price) ?? 0,
  //       discount: Number(it.discount) ?? 0,
  //       store_id: it.store_id,
  //     }));

  //     const orderPayload = {
  //       items,
  //       subtotal,

  //       discount: 0,
  //       tax: 0,
  //       shipping_fee: deliveryFee|| 0,
  //       grand_total: total ?? 0,
  //       payment_method: selectedPayment,
  //       shipping_address_id: 'e5937ba8-9472-11f0-8c40-06b20f833363',
  //       notes: null,
  //       metadata: {simulated: true},
  //     };

  //     const orderRes = await axiosInstance.post('/orders', orderPayload);
  //     console.log("response from backend",orderRes)
  //     const orderData = orderRes.data;

  //     if (!orderData || !orderData.order_number) {
  //       console.error('Order creation failed:', orderData);
  //       Alert.alert('Error', 'Failed to create order');
  //       setIsProcessing(false);
  //       return;
  //     }
  //     if (selectedPayment === 'cod' || selectedPayment === 'cash_on_delivery') {
  //       setIsProcessing(false);
  //       navigation.navigate('PaymentSuccess', {
  //         transactionId: orderData.transaction_id,
  //         paymentMethod: orderData.payment_method || 'cod',
  //         dateTime: orderData.placed_at,
  //         amount: orderData.amount_paid ?? orderPayload.grand_total,
  //         orderId: orderData.order_number,
  //         orderItems: orderData.order_items ?? orderPayload.items,
  //       });
  //       return;
  //     }
  //     const host = 'http://10.0.2.2:3020';

  //     const createPaymentPayload = {
  //       amount: orderData.amount_paid ?? orderPayload.grand_total,
  //       currency: 'INR',
  //       paymentMethod: selectedPayment,
  //       orderId: orderData.order_number,
  //       userId: user.user_id,
  //       customerPhone: user.phone,
  //       customerEmail: user.email,
  //       customerName: user.name,
  //       billingAddress: {
  //         name: 'Test User',
  //         street: '123 Test St',
  //         city: 'Mumbai',
  //         state: 'Maharashtra',
  //         pincode: '400001',
  //         country: 'India',
  //       },
  //       shippingAddress: {
  //         name: 'Test User',
  //         street:  'Unknown Address',
  //         city: 'Mumbai',
  //         state: 'Maharashtra',
  //         pincode: '400001',
  //         country: 'India',
  //         phone: '+919876543210',
  //       },
  //     };

  //     const createRes = await axios.post(
  //       `${host}/api/payments/create`,
  //       createPaymentPayload,
  //       {headers: {'Content-Type': 'application/json'}},
  //     );

  //     const createData = createRes.data;
  //     console.log('Payment create response', createData);

  //     if (!createData || !createData.success) {
  //       console.error('Payment creation failed:', createData);
  //       Alert.alert('Error', createData?.message || 'Failed to create payment');
  //       setIsProcessing(false);
  //       return;
  //     }
  //     const {
  //       key,
  //       razorpayOrderId,
  //       amount: returnedAmount,
  //       currency,
  //       paymentId: backendPaymentId,
  //     } = createData.data;

  //     const options = {
  //       description: `Order #${orderData.order_number}`,
  //       image: 'https://your-logo-url.com/logo.png',
  //       currency: currency || 'INR',
  //       key,
  //       amount: Math.round((returnedAmount ?? orderPayload.grand_total) * 100), // paise
  //       order_id: razorpayOrderId,
  //       name: 'Your Company', // replace with store name
  //       prefill: {
  //         email: createPaymentPayload.customerEmail,
  //         contact: createPaymentPayload.customerPhone,
  //         name: createPaymentPayload.customerName,
  //       },
  //       theme: {color: '#FF6B6B'},
  //     };

  //     let razorpayResp;
  //     try {
  //       razorpayResp = await RazorpayCheckout.open(options);
  //     } catch (err) {
  //       console.error('Razorpay checkout error/cancel:', err);
  //       Alert.alert('Payment Cancelled', 'Payment was cancelled or failed');
  //       setIsProcessing(false);
  //       return;
  //     }

  //     const confirmRes = await axios.post(
  //       `${host}/api/payments/confirm`,
  //       {
  //         paymentId: backendPaymentId,
  //         paymentMethod: selectedPayment,
  //         paymentData: {
  //           razorpayOrderId: razorpayResp.razorpay_order_id,
  //           razorpayPaymentId: razorpayResp.razorpay_payment_id,
  //           razorpaySignature: razorpayResp.razorpay_signature,
  //         },
  //         metadata: {
  //           appOrderId: orderData.order_number,
  //         },
  //       },
  //       {headers: {'Content-Type': 'application/json'}},
  //     );

  //     const confirmData = confirmRes.data;
  //     console.log('Payment confirm response', confirmData);

  //     if (!confirmData || !confirmData.success) {
  //       console.error('Payment confirmation failed:', confirmData);
  //       Alert.alert(
  //         'Payment Error',
  //         confirmData?.message || 'Payment confirmation failed on server',
  //       );
  //       setIsProcessing(false);
  //       return;
  //     }
  //     setIsProcessing(false);
  //     navigation.navigate('PaymentSuccess', {
  //       transactionId:
  //         confirmData.data?.transactionId ?? orderData.transaction_id,
  //       paymentMethod: selectedPayment,
  //       dateTime: confirmData.data?.paidAt ?? new Date().toISOString(),
  //       amount: confirmData.data?.amount ?? orderData.amount_paid,
  //       orderId: orderData.order_number,
  //       orderItems: orderData.order_items ?? orderPayload.items,
  //     });
  //   } catch (err: any) {
  //     console.error('Payment flow error:', err);
  //     Alert.alert(
  //       'Error',
  //       err.message || 'Something went wrong during payment',
  //     );
  //     setIsProcessing(false);
  //   }
  // };

  const handleProceed = async () => {
    console.log("calling proceed")
    if (!selectedPayment) {
      Alert.alert('Select payment', 'Please select a payment method');
      return;
    }

    try {
      setIsProcessing(true);

      const items = (allItems || []).map((it: any) => ({
        product_id: it.productId,
        product_name: it.name,
        quantity: it.qty,
        price: Number(it.price) ?? 0,
        discount: Number(it.discount) ?? 0,
        store_id: it.store_id,
      }));

      const orderPayload = {
        items,
        subtotal,
        discount: 0,
        tax: 0,
        shipping_fee: deliveryFee || 0,
        grand_total: total ?? 0,
        payment_method: selectedPayment,
        shipping_address_id: shippingAddress?.id,
        notes: null,
        metadata: {simulated: true},
      };

      const orderRes = await axiosInstance.post('/orders', orderPayload);
      // console.log("orderRes",orderRes)
      const orderData = orderRes.data;

      if (!orderData || !orderData.order_number) {
        console.error('Order creation failed:', orderData);
        Alert.alert('Error', 'Failed to create order');
        setIsProcessing(false);
        return;
      }

      // ✅ CASE 1: COD (no Razorpay)
      if (selectedPayment === 'cod' || selectedPayment === 'cash_on_delivery') {
        setIsProcessing(false);

      
        const createdOrderId =
          orderData.order_id ?? orderData.id ?? orderData.order_number;

        // if your OrderTracking is inside ProfileTab stack:
        navigation.navigate('ProfileTab', {
          screen: 'OrderTracking',
          params: {orderId: String(createdOrderId)},
        });

        return;
      }

      // ✅ CASE 2: Online payment (Razorpay)
      const host = 'http://10.0.2.2:3021';
      // const host = 'https://trend-rush-payment.vercel.app';

      // const host = 'http://10.151.231.172:3020';
      console.log("user phone",user.phone)
      const createPaymentPayload = {
        amount: Math.floor(orderData.amount_paid) ?? Math.floor(orderPayload.grand_total),
        currency: 'INR',
        paymentMethod: selectedPayment,
        orderId: orderData.order_number,
        userId: user.user_id,
        // customerPhone: user.phone,
        customerPhone: '+919876543210',
        customerEmail: user.email,
        customerName: user.name,
        billingAddress: {
          name: 'Test User',
          street: '123 Test St',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          country: 'India',
        },
        shippingAddress: {
          name: 'Test User',
          street: 'Unknown Address',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          country: 'India',
          phone: '+919876543210',
        },
      };
      console.log("data to the backend",createPaymentPayload)
      const createRes = await axios.post(
        `${host}/api/payments/create`,
        createPaymentPayload,
      );
      console.log("create data",createRes)
      const createData = createRes.data;
      if (!createData || !createData.success) {
        console.error('Payment creation failed:', createData);
        Alert.alert('Error', createData?.message || 'Failed to create payment');
        setIsProcessing(false);
        return;
      }

      const {
        key,
        razorpayOrderId,
        amount: returnedAmount,
        currency,
        paymentId: backendPaymentId,
      } = createData.data;

      const options = {
        description: `Order #${orderData.order_number}`,
        image: 'https://your-logo-url.com/logo.png',
        currency: currency || 'INR',
        key,
        amount: Math.round((returnedAmount ?? orderPayload.grand_total) * 100),
        order_id: razorpayOrderId,
        name: 'Your Company',
        prefill: {
          email: createPaymentPayload.customerEmail,
          contact: createPaymentPayload.customerPhone,
          name: createPaymentPayload.customerName,
        },
        theme: {color: '#FF6B6B'},
      };

      let razorpayResp;
      try {
        razorpayResp = await RazorpayCheckout.open(options);
      } catch (err) {
        console.error('Razorpay checkout error/cancel:', err);
        Alert.alert('Payment Cancelled', 'Payment was cancelled or failed');
        setIsProcessing(false);
        return;
      }

      const confirmRes = await axios.post(`${host}/api/payments/confirm`, {
        paymentId: backendPaymentId,
        paymentMethod: selectedPayment,
        paymentData: {
          razorpayOrderId: razorpayResp.razorpay_order_id,
          razorpayPaymentId: razorpayResp.razorpay_payment_id,
          razorpaySignature: razorpayResp.razorpay_signature,
        },
        metadata: {appOrderId: orderData.order_number},
      });

      const confirmData = confirmRes.data;

      if (!confirmData || !confirmData.success) {
        console.error('Payment confirmation failed:', confirmData);
        Alert.alert(
          'Payment Error',
          confirmData?.message || 'Payment confirmation failed on server',
        );
        setIsProcessing(false);
        return;
      }

      setIsProcessing(false);


      const createdOrderId =
        orderData.order_id ?? orderData.id ?? orderData.order_number;

      navigation.navigate('ProfileTab', {
        screen: 'OrderTracking',
        params: {orderId: String(createdOrderId)},
      });
    } catch (err: any) {
      console.error('Payment flow error:', err);
      Alert.alert(
        'Error',
        err.message || 'Something went wrong during payment',
      );
      setIsProcessing(false);
    }
  };

  //danush payment screen
  // const handleProceed = async () => {
  //   if (!selectedPayment) {
  //     Alert.alert('Select payment', 'Please select a payment method');
  //     return;
  //   }

  //   try {
  //     setIsProcessing(true);
  //     const items = (cartData.items || []).map((it: any) => ({
  //       product_id: it.productId,
  //       product_name: it.name,
  //       quantity: it.qty,
  //       price: Number(it.price) ?? 0,
  //       discount: Number(it.discount) ?? 0,
  //     }));

  //     const orderPayload = {
  //       items,
  //       subtotal:
  //         cartData.subtotal ??
  //         items.reduce((s: number, it: any) => s + it.price * it.quantity, 0),
  //       discount: 0,
  //       tax: cartData.gst ?? 0,
  //       shipping_fee: cartData.deliveryFee ?? 0,
  //       grand_total: cartData.total ?? 0,
  //       payment_method: selectedPayment,
  //       shipping_address_id: 'e5937ba8-9472-11f0-8c40-06b20f833363', // replace with real ids
  //       notes: null,
  //       metadata: { simulated: true },
  //     };

  //     const orderRes = await axiosInstance.post('/orders', orderPayload);
  //     const orderData = orderRes.data;

  //     if (!orderData || !orderData.order_number) {
  //       Alert.alert('Error', 'Failed to create order');
  //       setIsProcessing(false);
  //       return;
  //     }

  //     // COD -> skip payment screen
  //     if (selectedPayment === 'cod' || selectedPayment === 'cash_on_delivery') {
  //       setIsProcessing(false);
  //       navigation.navigate('PaymentSuccess', {
  //         transactionId: orderData.transaction_id,
  //         paymentMethod: orderData.payment_method || 'cod',
  //         dateTime: orderData.placed_at,
  //         amount: orderData.amount_paid ?? orderPayload.grand_total,
  //         orderId: orderData.order_number,
  //         orderItems: orderData.order_items ?? orderPayload.items,
  //       });
  //       return;
  //     }

  //     // For non-COD: handoff to Payment screen with necessary data
  //     setIsProcessing(false);
  //     navigation.navigate('Payment', {
  //       orderData, // full order response from backend
  //       paymentMethod: selectedPayment,
  //       user, // pass user object so Payment screen can prefill
  //     });
  //   } catch (err: any) {
  //     console.error('Payment flow error:', err);
  //     Alert.alert('Error', err.message || 'Something went wrong during payment');
  //     setIsProcessing(false);
  //   }
  // };

  //   const handleProceed = async () => {
  //   if (!selectedPayment) {
  //     Alert.alert('Select payment', 'Please select a payment method');
  //     return;
  //   }

  //   try {
  //     setIsProcessing(true);

  //     // map cart -> order items for both order creation and payment metadata
  //     const items = (cartData.items || []).map((it: any) => ({
  //       product_id: it.productId,
  //       product_name: it.name,
  //       quantity: it.qty,
  //       price: Number(it.price) ?? 0,
  //       discount: Number(it.discount) ?? 0,
  //     }));

  //     // build order payload (same as you had)
  //     const orderPayload = {
  //       items,
  //       subtotal:
  //         cartData.subtotal ??
  //         items.reduce((s: number, it: any) => s + it.price * it.quantity, 0),
  //       discount: 0,
  //       tax: cartData.gst ?? 0,
  //       shipping_fee: cartData.deliveryFee ?? 0,
  //       grand_total: cartData.total ?? 0,
  //       payment_method: selectedPayment,
  //       shipping_address_id: 'e5937ba8-9472-11f0-8c40-06b20f833363', // TODO: replace with real selected address id
  //       // If you have billing_address_id keep it here, otherwise we reuse shipping below.
  //       // billing_address_id: cartData.billingAddressId ?? null,
  //       notes: null,
  //       metadata: { simulated: true },
  //     };

  //     // 1) Create order (same server you already had)
  //     const orderRes = await axiosInstance.post('/orders', orderPayload);
  //     const orderData = orderRes.data;

  //     if (!orderData || !orderData.order_number) {
  //       console.error('Order creation failed:', orderData);
  //       Alert.alert('Error', 'Failed to create order');
  //       setIsProcessing(false);
  //       return;
  //     }

  //     // If COD — you may choose to create a payment record for COD on server as well.
  //     // If you want to skip server payment creation for COD, keep this. Otherwise call payments/create for COD too.
  //     if (selectedPayment === 'cod' || selectedPayment === 'cash_on_delivery') {
  //       setIsProcessing(false);
  //       navigation.navigate('PaymentSuccess', {
  //         transactionId: orderData.transaction_id,
  //         paymentMethod: orderData.payment_method || 'cod',
  //         dateTime: orderData.placed_at,
  //         amount: orderData.amount_paid ?? orderPayload.grand_total,
  //         orderId: orderData.order_number,
  //         orderItems: orderData.order_items ?? orderPayload.items,
  //       });
  //       return;
  //     }

  //     // 2) Create payment on backend
  //     const host = getPaymentsHost();
  //     // Payment create payload must include shippingAddress.addressId and billingAddress.addressId
  //     const createPaymentPayload = {
  //       amount: orderData.amount_paid ?? orderPayload.grand_total,
  //       currency: 'INR',
  //       paymentMethod: selectedPayment, // 'card'|'upi' etc
  //       orderId: orderData.order_number, // server code resolves numeric order_id or order_number
  //       userId: user.user_id,
  //       customerPhone: user.phone,
  //       customerEmail: user.email,
  //       customerName: user.name,
  //       // send addressId references (required by your SQL-backed endpoint)
  //       // billingAddress: {
  //       //   addressId: cartData.billingAddressId ?? orderPayload.shipping_address_id, // prefer real billing id
  //       // },
  //       shippingAddress: {
  //         addressId: orderPayload.shipping_address_id,
  //       },
  //       // include items too so server can save metadata/items
  //       items,
  //       // optional GST number if available
  //       gstNumber: cartData.gstNumber ?? null,
  //     };

  //     // const createRes = await axios.post(`${host}/api/payments/create`, createPaymentPayload, {
  //     //   headers: { 'Content-Type': 'application/json' },
  //     // });
  //     const createRes= await axiosInstance.post("/payments/create", createPaymentPayload);
  //     const createData = createRes.data;
  //     console.log('Payment create response', createData);

  //     if (!createData || !createData.success) {
  //       console.error('Payment creation failed:', createData);
  //       Alert.alert('Error', createData?.message || 'Failed to create payment');
  //       setIsProcessing(false);
  //       return;
  //     }

  //     // backend should return data.paymentId (DB PK), data.key, data.razorpayOrderId, data.amount
  //     const backendPaymentId = createData.data?.paymentId;
  //     const key = createData.data?.key;
  //     const razorpayOrderId = createData.data?.razorpayOrderId ?? createData.data?.orderId;
  //     const returnedAmount = createData.data?.amount ?? orderPayload.grand_total;
  //     const currency = createData.data?.currency ?? 'INR';

  //     if (!backendPaymentId) {
  //       console.error('Payment create returned no paymentId', createData);
  //       Alert.alert('Error', 'Payment creation returned incomplete data');
  //       setIsProcessing(false);
  //       return;
  //     }

  //     // 3) Open Razorpay (amount must be in paise)
  //     const options = {
  //       description: `Order #${orderData.order_number}`,
  //       image: 'https://your-logo-url.com/logo.png',
  //       currency,
  //       key,
  //       amount: Math.round((returnedAmount ?? orderPayload.grand_total) * 100), // paise
  //       order_id: razorpayOrderId,
  //       name: 'Your Company', // replace with store name
  //       prefill: {
  //         email: createPaymentPayload.customerEmail,
  //         contact: createPaymentPayload.customerPhone,
  //         name: createPaymentPayload.customerName,
  //       },
  //       theme: { color: '#FF6B6B' },
  //     };

  //     let razorpayResp;
  //     try {
  //       razorpayResp = await RazorpayCheckout.open(options);
  //       // Example response: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
  //     } catch (err) {
  //       console.error('Razorpay checkout error/cancel:', err);
  //       Alert.alert('Payment Cancelled', 'Payment was cancelled or failed');
  //       // Optionally: call backend to mark payment attempt failed/cancelled (not done here)
  //       setIsProcessing(false);
  //       return;
  //     }

  //     // 4) Confirm payment on backend (supply DB paymentId)
  //     // const confirmRes = await axios.post(
  //     //   `${host}/api/payments/confirm`,
  //     //   {
  //     //     paymentId: backendPaymentId,
  //     //     paymentMethod: selectedPayment,
  //     //     paymentData: {
  //     //       razorpayOrderId: razorpayResp.razorpay_order_id,
  //     //       razorpayPaymentId: razorpayResp.razorpay_payment_id,
  //     //       razorpaySignature: razorpayResp.razorpay_signature,
  //     //     },
  //     //     metadata: {
  //     //       appOrderId: orderData.order_number,
  //     //     },
  //     //   },
  //     //   { headers: { 'Content-Type': 'application/json' } }
  //     // );
  //     const confirmRes=await axiosInstance.post("/payments/confirm", {
  //        paymentId: backendPaymentId,
  //         paymentMethod: selectedPayment,
  //         paymentData: {
  //           razorpayOrderId: razorpayResp.razorpay_order_id,
  //           razorpayPaymentId: razorpayResp.razorpay_payment_id,
  //           razorpaySignature: razorpayResp.razorpay_signature,
  //         },
  //         metadata: {
  //           appOrderId: orderData.order_number,
  //         },
  //     })
  //     const confirmData = confirmRes.data;
  //     console.log('Payment confirm response', confirmData);

  //     if (!confirmData || !confirmData.success) {
  //       console.error('Payment confirmation failed:', confirmData);
  //       Alert.alert('Payment Error', confirmData?.message || 'Payment confirmation failed on server');
  //       setIsProcessing(false);
  //       return;
  //     }

  //     // success -> navigate to success screen
  //     setIsProcessing(false);
  //     navigation.navigate('PaymentSuccess', {
  //       transactionId: confirmData.data?.transactionId ?? orderData.transaction_id,
  //       paymentMethod: selectedPayment,
  //       dateTime: confirmData.data?.paidAt ?? new Date().toISOString(),
  //       amount: confirmData.data?.amount ?? returnedAmount,
  //       orderId: orderData.order_number,
  //       orderItems: orderData.order_items ?? orderPayload.items,
  //     });
  //   } catch (err: any) {
  //     console.error('Payment flow error:', err);
  //     Alert.alert('Error', err.message || 'Something went wrong during payment');
  //     setIsProcessing(false);
  //   }
  // };
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment</Text>

          {paymentMethods.map(method => (
            <View key={method.id}>
              <TouchableOpacity
                style={[
                  styles.paymentOption,
                  selectedPayment === method.id && styles.selectedOption,
                ]}
                onPress={() => handlePaymentSelect(method.id)}>
                <Icon name={method.icon} size={24} color="#666" />
                <Text style={styles.paymentLabel}>{method.label}</Text>
                <View style={styles.radioContainer}>
                  {selectedPayment === method.id ? (
                    <Icon
                      name="radio-button-checked"
                      size={20}
                      color="#FF6B6B"
                    />
                  ) : (
                    <Icon
                      name="radio-button-unchecked"
                      size={20}
                      color="#ccc"
                    />
                  )}
                </View>
              </TouchableOpacity>

              {/* Expand forms below each option */}
              {selectedPayment === 'card' && method.id === 'card' && (
                <View style={styles.cardForm}>
                  <Text style={styles.formTitle}>Card Details</Text>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Card Number</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="XXXX XXXX XXXX XXXX"
                      value={cardNumber}
                      onChangeText={setCardNumber}
                      keyboardType="numeric"
                      maxLength={19}
                    />
                  </View>

                  <View style={styles.rowContainer}>
                    <View style={styles.halfInput}>
                      <Text style={styles.inputLabel}>Valid Thru</Text>
                      <TextInput
                        style={styles.textInput}
                        placeholder="MM / YY"
                        value={expiryDate}
                        onChangeText={setExpiryDate}
                        keyboardType="numeric"
                        maxLength={5}
                      />
                    </View>
                    <View style={styles.halfInput}>
                      <Text style={styles.inputLabel}>CVV</Text>
                      <TextInput
                        style={styles.textInput}
                        placeholder="CVV"
                        value={cvv}
                        onChangeText={setCvv}
                        keyboardType="numeric"
                        maxLength={3}
                        secureTextEntry
                      />
                    </View>
                  </View>
                </View>
              )}

              {selectedPayment === 'netbanking' &&
                method.id === 'netbanking' && (
                  <View style={styles.cardForm}>
                    <Text style={styles.formTitle}>Net Banking</Text>
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Bank Name</Text>
                      <TextInput
                        style={styles.textInput}
                        placeholder="Enter Bank Name"
                        value={netBank}
                        onChangeText={setNetBank}
                      />
                    </View>
                  </View>
                )}

              {selectedPayment === 'upi' && method.id === 'upi' && (
                <View style={styles.cardForm}>
                  <Text style={styles.formTitle}>UPI Details</Text>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>UPI ID</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="example@upi"
                      value={upiId}
                      onChangeText={setUpiId}
                      keyboardType="email-address"
                    />
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Gift Card Section */}
        <View style={styles.section}>
          <View style={styles.giftCardContainer}>
            <Icon name="card-giftcard" size={20} color="#666" />
            <Text style={styles.giftCardText}>Have a Gift Card?</Text>
            <TouchableOpacity>
              <Text style={styles.addButton}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <CartSummary
        total={total}
        buttonText="Proceed to Payment"
        onConfirm={handleProceed}
        disabled={!selectedPayment}
      />
    </View>
  );
};
export default PaymentStep;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  scrollView: {flex: 1},
  section: {paddingHorizontal: 16, paddingVertical: 12},
  sectionTitle: {fontSize: 16, fontWeight: '600', marginBottom: 12},
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#eee',
  },
  selectedOption: {backgroundColor: '#fafafa'},
  paymentLabel: {flex: 1, marginLeft: 12, fontSize: 15, color: '#333'},
  radioContainer: {marginLeft: 8},
  cardForm: {paddingVertical: 12, paddingLeft: 36},
  formTitle: {fontWeight: '600', marginBottom: 8},
  inputContainer: {marginBottom: 12},
  inputLabel: {fontSize: 13, color: '#555', marginBottom: 4},
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
  },
  rowContainer: {flexDirection: 'row', justifyContent: 'space-between'},
  halfInput: {flex: 1, marginRight: 8},
  giftCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  giftCardText: {flex: 1, marginLeft: 8, fontSize: 14, color: '#333'},
  addButton: {color: '#FF6B6B', fontWeight: '600'},
});
