
import React, { useState } from 'react';
import { ScrollView, StyleSheet, SafeAreaView, View, Alert, Platform } from 'react-native';
import OrderStatusCard from '../components/OrderDetails/OrderStatusCard';
import DeliveryTimeline from '../components/OrderDetails/DeliveryTimeline';
import StoreSection from '../components/OrderDetails/StoreSection';
import BillDetails from '../components/OrderDetails/BillDetails';
import ActionButtons from '../components/OrderDetails/ActionButtons';
import HeaderWithNoIcons from '../components/Profile/HeaderWithNoIcons';

import { openFile, requestAndSaveInvoice } from '../../services/invoiceClient';
import FinalProductItem from '../../home/components/Cart/FinalProductItem';

interface OrderDetailsScreenProps {
  route: {
    params: {
      order: any;
    };
  };
  navigation: any;
}

const OrderDetailsScreen: React.FC<OrderDetailsScreenProps> = ({ route, navigation }) => {
  const { order } = route.params ?? {};
  
  const [loading, setLoading] = useState(false);
  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en', { month: 'short' });
    const time = date.toLocaleString('en', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    return `${day} ${month}, ${time}`;
  };

  // Timeline data (sample)
  const timelineItems = [
    {
      label: 'Max',
      address: 'Near the Chaitanyapuri Metro Station',
      isActive: true,
    },
    {
      label: 'H & M',
      address: 'Near the Chaitanyapuri Metro Station',
    },
    {
      label: 'Zudio',
      address: 'Green Hills colony, kothapet',
    },
    {
      label: 'Home',
      address: order?.shippingAddress?.addressLine1 || '18-6-60, Laldarvaza',
    },
  ];

  
  async function handleDownloadInvoice() {
  try {
    setLoading(true);
    const { localPath } = await requestAndSaveInvoice(order.orderId);
    setLoading(false);
    Alert.alert('Saved', 'Invoice saved', [{ text: 'Open', onPress: () => openFile(localPath) }, { text: 'OK' }]);
  } catch (err) {
    setLoading(false);
    console.error('Invoice download error', err);
    Alert.alert('Error', err?.message || 'Download failed');
  }
}
  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithNoIcons title="Order Details" onBack={() => navigation.goBack()} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Order Status */}
        <OrderStatusCard
          orderStatus={order?.orderStatus || 'ON THE WAY'}
          orderId={order?.orderId || order?.orderNumber}
          orderDate={formatDate(order?.placedAt)}
        />

        {/* Delivery Timeline */}
        <DeliveryTimeline items={timelineItems} />

        {/* Store Groups with Items */}
        {order?.storeGroups?.map((storeGroup: any, index: number) => (
          <View key={storeGroup.storeGroupId || index}>
            <StoreSection
              storeName={storeGroup.storeName}
              storeLocation={storeGroup.storeLocation || `Kothapet & Dilsukhnagar`}
              storeLogo={storeGroup.storeLogo || storeGroup.logo}
            />

            {/* Products */}
            <View style={styles.productsContainer}>
              {storeGroup.items?.map((item: any, idx: number) => (
                <FinalProductItem key={item.orderItemId ?? idx} item={item} />
              ))}
            </View>
          </View>
        ))}

        {/* Bill Details */}
        <BillDetails
          subtotal={Number(order?.subtotal ?? 0)}
          deliveryPartnerFee={0}
          deliveryFee={Number(order?.shippingFee ?? 0)}
          gstAndProductCharges={Number(order?.tax ?? 0)}
          platformFee={Number(order?.platformFee ?? 0) || 0}
          totalBill={Number(order?.grandTotal ?? 0)}
        />
      </ScrollView>

      {/* Action Buttons: pass invoice handler */}
      <ActionButtons
        order={order}
        onNeedHelp={() => {
          console.log("pressed on help")
          navigation.navigate('HelpAndSupport')}}
        onDownloadInvoice={handleDownloadInvoice} // <-- hooked up
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollView: {
    flex: 1,
  },
  productsContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
});

export default OrderDetailsScreen;
