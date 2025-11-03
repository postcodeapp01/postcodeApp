import React, { useState } from 'react';
import { View, Button, Alert } from 'react-native';
import RazorpayCheckout, { RazorpayOptions } from 'react-native-razorpay';
import axios from 'axios';
interface BillingAddress {
  name: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

interface ShippingAddress extends BillingAddress {
  phone: string;
}

interface CreatePaymentResponse {
  success: boolean;
  data: {
    key: string;
    amount: number;
    currency: string;
    razorpayOrderId: string;
    paymentId: string;
  };
}

interface ConfirmPaymentResponse {
  success: boolean;
  message?: string;
}

const PaymentScreen: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const createPayment = async () => {
    setLoading(true);

    try {
      const payload = {
        amount: 100,
        currency: 'INR',
        paymentMethod: 'card',
        orderId: 'MOBILE_TEST_' + Date.now(),
        userId: 'user_001',
        customerPhone: '+919876543210',
        customerEmail: 'test@example.com',
        customerName: 'Test User',
        billingAddress: {
          name: 'Test User',
          street: '123 Test St',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          country: 'India'
        } as BillingAddress,
        shippingAddress: {
          name: 'Test User',
          street: '123 Test St',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          country: 'India',
          phone: '+919876543210'
        } as ShippingAddress
      };

      const { data } = await axios.post<CreatePaymentResponse>(
        'http://10.0.2.2:3020/api/payments/create',
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (data.success) {
        openRazorpay(data.data);
      } else {
        Alert.alert('Error', 'Payment creation failed');
      }
    } catch (error) {
      console.error('Error creating payment:', error);
      Alert.alert('Error', 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  const openRazorpay = (data: CreatePaymentResponse['data']) => {
    const options: RazorpayOptions = {
      description: 'Test Payment',
      image: 'https://your-logo-url.com/logo.png',
      currency: data.currency,
      key: data.key,
      amount: data.amount * 100, // convert to paise
      order_id: data.razorpayOrderId,
      name: 'Your Company',
      prefill: {
        email: 'test@example.com',
        contact: '+919876543210',
        name: 'Test User'
      },
      theme: { color: '#3399cc' }
    };

    RazorpayCheckout.open(options)
      .then((response) => confirmPayment(data.paymentId, response))
      .catch(() => {
        Alert.alert('Error', 'Payment failed or cancelled');
      });
  };

  const confirmPayment = async (
    paymentId: string,
    razorpayResponse: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }
  ) => {
    try {
      const { data } = await axios.post<ConfirmPaymentResponse>(
        'http://10.0.2.2:3020/api/payments/confirm',
        {
          paymentId,
          paymentMethod: 'card',
          paymentData: {
            razorpayOrderId: razorpayResponse.razorpay_order_id,
            razorpayPaymentId: razorpayResponse.razorpay_payment_id,
            razorpaySignature: razorpayResponse.razorpay_signature
          }
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (data.success) {
        Alert.alert('Success', 'Payment successful!');
        
      } else {
        Alert.alert('Error', data.message || 'Payment confirmation failed');
      }
    } catch (error) {
      console.error('Confirmation error:', error);
      Alert.alert('Error', 'Payment confirmation failed!');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        title={loading ? 'Processing...' : 'Pay ₹100'}
        onPress={createPayment}
        disabled={loading}
      />
    </View>
  );
};

export default PaymentScreen;
