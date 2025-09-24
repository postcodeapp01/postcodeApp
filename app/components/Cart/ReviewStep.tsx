import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import CartSummary from './CartSummary';
import {CartData} from '../../screens/CartScreen';
import OfferSection from '../BuyNow/OfferSection';
interface ReviewStepProps {
  cartData: CartData;
  onNext: () => void;
}

const ReviewStep: React.FC<ReviewStepProps> = ({cartData, onNext}) => {
  // console.log('Review Step', cartData.items);
  const formatPrice = (p: number) => `₹${p}`;
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 100 }} 
        showsVerticalScrollIndicator={false}>
        {/* Delivery Address Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <TouchableOpacity>
              <Text style={styles.changeButton}>CHANGE</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.addressText}>{cartData.deliveryAddress}</Text>
        </View>

        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          {cartData.items.map(item => (
            <View key={item.cartId} style={styles.orderItem}>
              <Image
                source={item.image?{uri: item.image}: require('../../../sources/images/c1.png')}
                style={styles.itemImage}
                resizeMode="cover"
              />
              <View style={styles.itemDetails}>
                <Text style={styles.itemBrand}>{item.brand}</Text>
                <Text style={styles.itemName}>{item.name}</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.priceText}>
                    {formatPrice(item.price)}
                  </Text>
                  {item.originalPrice ? (
                    <Text style={styles.originalPrice}>
                      {formatPrice(item.originalPrice)}
                    </Text>
                  ) : null}
                  {item.discount ? (
                    <View style={styles.discountPill}>
                      <Text style={styles.discountText}>
                        {item.discount}% OFF
                      </Text>
                    </View>
                  ) : null}
                </View>

                <Text style={styles.itemMeta}>
                  Size: {item.size} | Qty: {item.qty}
                </Text>
              </View>
            </View>
          ))}
        </View>
        {/* Offers Section */}
        <OfferSection offers={ [
          {
            code: 'FIRST',
            discount: 100,
            description: 'Save ₹100 on first order',
          },
        ]} />

        {/* Bill Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bill Details</Text>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Product Total</Text>
            <Text style={styles.billValue}>₹ {cartData.subtotal}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Delivery partner fee</Text>
            <Text style={styles.billValue}>₹ {cartData.deliveryFee}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>GST and product charges</Text>
            <Text style={styles.billValue}>₹ {cartData.gst}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Platform fee</Text>
            <Text style={styles.billValue}>₹ {cartData.platformFee}</Text>
          </View>
          <View style={[styles.billRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Bill</Text>
            <Text style={styles.totalValue}>₹ {cartData.total}</Text>
          </View>
        </View>
      </ScrollView>

      <CartSummary
        total={cartData.total}
        buttonText="Proceed to Payment"
        onConfirm={onNext}
      />
    </View>
  );
};

export default ReviewStep;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingBottom: 120,
  },
  section: {
    backgroundColor: '#fff',
    marginVertical: 4,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  changeButton: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  orderItem: {
    height: 110,
    flexDirection: 'row',
    paddingHorizontal: 19,
    paddingVertical: 9,
    paddingTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 12,
    fontWeight: '600',
    marginRight: 8,
    color: '#111',
    letterSpacing: -0.32,
  },
  originalPrice: {
    fontSize: 12,
    color: '#AAAAAA',
    textDecorationLine: 'line-through',
    marginRight: 1,
  },
  discountPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  discountText: {
    fontSize: 11,
    color: '#B51C0F',
    fontWeight: '600',
    letterSpacing: -0.32,
  },

  itemImage: {
    width: 60,
    height: 80,
    borderRadius: 5,
    marginRight: 10,
  },
  itemDetails: {
    top:8,
    height:59,
  },
  itemBrand: {
    fontSize: 12,
    color: '#000',
    textTransform: 'uppercase',
    lineHeight:15,
    letterSpacing:-0.32,
    fontWeight: '500',
  },
  itemName: {
    fontSize: 11,
    fontWeight: '500',
    color: '#909090',
 
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  itemMeta: {
    fontSize: 10,
    color: '#000',
    lineHeight: 12,
   
  },
  offerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffe0e0',
  },
  offerContent: {
    flex: 1,
    marginLeft: 12,
  },
  offerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B6B',
  },
  offerSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  applyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#FF6B6B',
    borderRadius: 4,
  },
  applyButtonText: {
    fontSize: 12,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  billLabel: {
    fontSize: 14,
    color: '#000',
    lineHeight:20,
    letterSpacing:-0.32,
  },
  billValue: {
    fontSize: 14,
    color: '#000',
    lineHeight:20,
    letterSpacing:-0.32,
  },
  totalRow: {
    borderTopWidth: 2,
    borderStyle: 'dashed',
    borderTopColor: '#AAA',
    marginTop: 5,
    paddingTop: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    lineHeight:20,
    letterSpacing:-0.32,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    lineHeight:20,
    letterSpacing:-0.32,
  },
});
