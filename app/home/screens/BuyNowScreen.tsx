import React, {useEffect, useState} from 'react';
import {ScrollView, ActivityIndicator, StyleSheet, View} from 'react-native';
import AddressSection from '../components/BuyNow/AddressSection';
import ProductSummary from '../components/BuyNow/ProductSummary';
import DeliveryOptions from '../components/BuyNow/DeliveryOptions';
import OfferSection from '../components/BuyNow/OfferSection';
import BillDetails from '../components/BuyNow/BillDetails';
import PaymentSection from '../components/BuyNow/PaymentSection';

interface BuyNowScreenProps {
  route: {
    params?: {
      id?: number;
    };
  };
}

const BuyNowScreen: React.FC<BuyNowScreenProps> = ({route}) => {
  const {id: productId} = route.params || {productId: '1', quantity: 1};
  interface CheckoutData {
    product: {
      id: string;
      title: string;
      price: number;
      originalPrice: number;
      discount: number;
      brand: string;
      image: string;
    };
    address: {
      id: number;
      name: string;
      address: string;
      phone: string;
    };
    delivery: {
      express: boolean;
      eta: string;
    };
    offers: Array<{
      code: string;
      discount: number;
      description: string;
    }>;
    billDetails: {
      productTotal: number;
      deliveryFee: number;
      gst: number;
      platformFee: number;
      total: number;
    };
    paymentMethods: string[];
  }

  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  console.log('hiihhihihh', productId);
  // Simulate API call with dummy data
  useEffect(() => {
    setTimeout(() => {
      setCheckoutData({
        product: {
          id: productId,
          title: 'Women X-Neck Regular Fit Top',
          price: 400,
          brand: 'Max',
          originalPrice: 1400,
          discount: 60,
          image: 'https://via.placeholder.com/80x80.png?text=Product',
        },
        address: {
          id: 1,
          name: 'Anila Kalagiri',
          address: '18-B-66, Lalidwarza, Hyderabad, 500053',
          phone: '9876543210',
        },
        delivery: {
          express: true,
          eta: '60 mins',
        },
        offers: [
          {
            code: 'FIRST',
            discount: 100,
            description: 'Save ₹100 on first order',
          },
        ],
        billDetails: {
          productTotal: 400,
          deliveryFee: 0,
          gst: 9,
          platformFee: 6,
          total: 415,
        },
        paymentMethods: ['Google Pay', 'COD', 'UPI'],
      });
    }, 1000);
  }, [productId]);

  if (!checkoutData) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#FF5964" />
      </View>
    );
  }

  return (
    <>
      <ScrollView>
        <AddressSection address={checkoutData.address} />
        <ProductSummary product={checkoutData.product} />
        <OfferSection offers={checkoutData.offers} />
        <DeliveryOptions delivery={checkoutData.delivery} />
        <BillDetails bill={checkoutData.billDetails} />
      </ScrollView>
      <PaymentSection />
    </>
  );
};

const styles = StyleSheet.create({
  loader: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});

export default BuyNowScreen;
