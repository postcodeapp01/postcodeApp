import React, { useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';

interface OrderItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  discount: number;
  image: string;
  deliveryTime: string;
  size?: string;
}

interface PaymentSuccessProps {
  transactionId?: string;
  paymentMethod?: string;
  dateTime?: string;
  amount?: number;
  orderId?: string;
  orderItems?: OrderItem[];
}

const PaymentSuccessScreen: React.FC<PaymentSuccessProps> = ({
  transactionId = "SN20Et3a476",
  paymentMethod = "COD",
  dateTime = "August 21,2025, 06:15pm",
  amount = 1034.00,
  orderId = "1T000860587",
  orderItems = [
    {
      id: "1",
      name: "Loose Regular Fit T-shirt",
      brand: "Max",
      price: 400,
      originalPrice: 800,
      discount: 50,
      image: "https://via.placeholder.com/80x100/90EE90/000000?text=Green+Top",
      deliveryTime: "35 mins",
      size: "M"
    },
    {
      id: "2", 
      name: "Loose Regular Fit T-shirt",
      brand: "NEPHRONS",
      price: 500,
      originalPrice: 1000,
      discount: 50,
      image: "https://via.placeholder.com/80x100/FF6347/FFFFFF?text=Red+Top",
      deliveryTime: "35 mins",
      size: "L"
    }
  ]
}) => {
  const [rating, setRating] = useState(0);
  const navigation = useNavigation();

  const handleStarPress = (starIndex: number) => {
    setRating(starIndex + 1);
  };

  const handleContinueShopping = () => {
    // Navigate to home or shop screen
    navigation.navigate('Home' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Success Icon and Message */}
        <View style={styles.successSection}>
          <View style={styles.successIcon}>
            <Icon name="check" size={32} color="#fff" />
          </View>
          <Text style={styles.successTitle}>Payment successful</Text>
        </View>

        {/* Transaction Details */}
        <View style={styles.detailsSection}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Transaction ID</Text>
            <Text style={styles.detailValue}>{transactionId}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Payment method</Text>
            <Text style={styles.detailValue}>{paymentMethod}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date & Time</Text>
            <Text style={styles.detailValue}>{dateTime}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Amount paid</Text>
            <Text style={styles.detailValueAmount}>₹{amount.toFixed(2)}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Order ID</Text>
            <Text style={styles.detailValue}>{orderId}</Text>
          </View>
        </View>

        {/* Order Items */}
        <View style={styles.orderSection}>
          {orderItems.map((item, index) => (
            <View key={item.id} style={styles.orderItem}>
              <View style={styles.deliveryHeader}>
                <Text style={styles.deliveryText}>
                  Delivery Expected in{' '}
                  <Text style={styles.deliveryTime}>{item.deliveryTime}</Text>
                </Text>
              </View>
              
              <View style={styles.itemContent}>
                <Image 
                  source={{ uri: item.image }} 
                  style={styles.itemImage}
                  resizeMode="cover"
                />
                
                <View style={styles.itemDetails}>
                  <Text style={styles.itemBrand}>{item.brand}</Text>
                  <Text style={styles.itemName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.itemPrice}>₹ {item.price}</Text>
                    <Text style={styles.originalPrice}>₹{item.originalPrice}</Text>
                    <Text style={styles.discount}>{item.discount}% OFF</Text>
                  </View>
                  {item.size && (
                    <Text style={styles.itemSize}>Size: {item.size}</Text>
                  )}
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Rating Section */}
        <View style={styles.ratingSection}>
          <Text style={styles.ratingTitle}>Rate Your experience</Text>
          <View style={styles.starsContainer}>
            {[...Array(5)].map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleStarPress(index)}
                style={styles.starButton}
              >
                <Icon
                  name={index < rating ? "star" : "star-border"}
                  size={40}
                  color={index < rating ? "#FFD700" : "#E0E0E0"}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Continue Shopping Button */}
      <View style={styles.bottomSection}>
        <TouchableOpacity 
          style={styles.continueButton}
          onPress={handleContinueShopping}
        >
          <Text style={styles.continueButtonText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PaymentSuccessScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  successSection: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#fff',
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF5964',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  detailsSection: {
    backgroundColor: '#fff',
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  detailValueAmount: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  orderSection: {
    marginTop: 8,
  },
  orderItem: {
    backgroundColor: '#fff',
    marginBottom: 8,
    paddingVertical: 16,
  },
  deliveryHeader: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  deliveryText: {
    fontSize: 14,
    color: '#666',
  },
  deliveryTime: {
    color: '#FF6B6B',
    fontWeight: '600',
  },
  itemContent: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  itemImage: {
    width: 80,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
  },
  itemDetails: {
    flex: 1,
  },
  itemBrand: {
    fontSize: 12,
    color: '#999',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginBottom: 8,
    lineHeight: 20,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  discount: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  itemSize: {
    fontSize: 12,
    color: '#666',
  },
  ratingSection: {
    backgroundColor: '#fff',
    marginTop: 8,
    paddingVertical: 30,
    alignItems: 'center',
  },
  ratingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  starButton: {
    paddingHorizontal: 5,
  },
  bottomSection: {
    backgroundColor: '#fff',
   
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  continueButton: {
    backgroundColor: '#FF5964',
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
