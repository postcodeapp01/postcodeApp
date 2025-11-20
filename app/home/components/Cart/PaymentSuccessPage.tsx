import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';

interface OrderItem {
  product_id: string;
  product_name: string;
  brand?: string | null;
  price: number;
  discount: number;
  quantity: number;
  image?: string | null;
  delivery_eta?: string;
}

type PaymentSuccessRouteParams = {
  PaymentSuccess: {
    transactionId: string;
    paymentMethod: string;
    dateTime: string;
    amount: number;
    orderId: string;
    orderItems: OrderItem[];
  };
};

const PaymentSuccessScreen: React.FC = () => {
  const [rating, setRating] = useState<number>(0);
  const navigation = useNavigation();
  const route =
    useRoute<RouteProp<PaymentSuccessRouteParams, 'PaymentSuccess'>>();

  const {transactionId, paymentMethod, dateTime, amount, orderId, orderItems} =
    route.params;
  console.log(
    'In payment success',
    
    orderItems,
  );
  const handleStarPress = (starIndex: number) => setRating(starIndex + 1);

  const handleContinueShopping = () => navigation.navigate('HomeScreen' as never);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        {/* ✅ Success Icon */}
        <View style={styles.successSection}>
          <View style={styles.successIcon}>
            <Icon name="check" size={32} color="#fff" />
          </View>
          <Text style={styles.successTitle}>Payment successful</Text>
        </View>

        {/* ✅ Transaction Details */}
        <View style={styles.detailsSection}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Transaction ID</Text>
            <Text style={styles.detailValue}>{transactionId}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Payment Method</Text>
            <Text style={styles.detailValue}>{paymentMethod}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date & Time</Text>
            <Text style={styles.detailValue}>
              {new Date(dateTime).toLocaleString()}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Amount Paid</Text>
            <Text style={styles.detailValueAmount}>₹{amount.toFixed(2)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Order ID</Text>
            <Text style={styles.detailValue}>{orderId}</Text>
          </View>
        </View>

        {/* ✅ Order Items */}
        <View style={styles.orderSection}>
          {orderItems.map(item => (
            <View key={item.product_id} style={styles.orderItem}>
              <View style={styles.deliveryHeader}>
                <Text style={styles.deliveryText}>
                  Delivery Expected in{' '}
                  <Text style={styles.deliveryTime}>
                    {item.delivery_eta || '30 mins'}
                  </Text>
                </Text>
              </View>

              <View style={styles.itemContent}>
                {item.image ? (
                  <Image
                    source={{uri: item.image}}
                    style={styles.itemImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={[styles.itemImage, {backgroundColor: '#ccc'}]} />
                )}

                <View style={styles.itemDetails}>
                  {item.brand && (
                    <Text style={styles.itemBrand}>{item.brand}</Text>
                  )}
                  <Text style={styles.itemName} numberOfLines={2}>
                    {item.product_name}
                  </Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.itemPrice}>₹{item.price}</Text>
                    {item.discount > 0 && (
                      <Text style={styles.discount}>{item.discount}% OFF</Text>
                    )}
                  </View>
                  <Text style={styles.itemSize}>Qty: {item.quantity}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* ✅ Rating */}
        <View style={styles.ratingSection}>
          <Text style={styles.ratingTitle}>Rate Your Experience</Text>
          <View style={styles.starsContainer}>
            {[...Array(5)].map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleStarPress(index)}
                style={styles.starButton}>
                <Icon
                  name={index < rating ? 'star' : 'star-border'}
                  size={40}
                  color={index < rating ? '#FFD700' : '#E0E0E0'}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* ✅ Continue Shopping */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinueShopping}>
          <Text style={styles.continueButtonText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PaymentSuccessScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  scrollView: {paddingHorizontal: 16},
  successSection: {alignItems: 'center', marginVertical: 20},
  successIcon: {
    width: 60,
    height: 60,
    backgroundColor: 'green',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  detailsSection: {
    marginVertical: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color:"#000"
  },
  detailValueAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E8B57',
  },
  orderSection: {marginTop: 10},
  orderItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  deliveryHeader: {
    marginBottom: 4,
  },
  deliveryText: {
    fontSize: 12,
    color: '#555',
  },
  deliveryTime: {
    fontWeight: 'bold',
  },
  itemContent: {
    flexDirection: 'row',
  },
  itemImage: {
    width: 80,
    height: 100,
    borderRadius: 6,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemBrand: {
    fontSize: 12,
    color: '#666',
  },
  itemName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 6,
  },
  discount: {
    fontSize: 12,
    color: 'green',
  },
  itemSize: {
    fontSize: 12,
    color: '#444',
    marginTop: 2,
  },
  ratingSection: {
    marginVertical: 20,
    alignItems: 'center',
  },
  ratingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  starButton: {
    marginHorizontal: 5,
  },
  bottomSection: {
    padding: 16,
  },
  continueButton: {
    backgroundColor: '#2E8B57',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueButtonText: {color: '#fff', fontSize: 16, fontWeight: 'bold'},
});
