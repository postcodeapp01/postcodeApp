import React, {useCallback, useMemo, useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import CartSummary from './CartSummary';
import OfferSection from '../BuyNow/OfferSection';
import AddressSelector from './AddressSelector';

interface ReviewStepProps {
  storeGroups: any[]; // all stores from CartStep
  onNext: () => void;
}

const ReviewStep: React.FC<ReviewStepProps> = ({storeGroups = [], onNext}) => {
  const formatPrice = (p: number) => `₹${p.toFixed(2)}`;
  const [appliedOffer, setAppliedOffer] = useState(null);

  const {subtotal, deliveryFee, gst, platformFee, total} = useMemo(() => {
    let subtotal = 0;
    let deliveryFee = 0;
    let gst = 0;
    let platformFee = 10; // example static platform fee

    storeGroups.forEach(store => {
      if (Array.isArray(store.items)) {
        store.items.forEach(item => {
          const itemPrice =
            typeof item.price === 'string'
              ? parseFloat(item.price)
              : Number(item.price) || 0;
          const qty = Number(item.qty) || 1;
          subtotal += itemPrice * qty;
        });
      }
      // if store has its own delivery fee, add it
      deliveryFee += Number(store.deliveryFee || 0);
    });

    gst = subtotal * 0.05; // Example: 5% GST
    const total = subtotal + deliveryFee + gst + platformFee;

    return {subtotal, deliveryFee, gst, platformFee, total};
  }, [storeGroups]);
  const offers = [
    {
      code: 'FIRST',
      discount: 100,
      description: 'Save ₹100 on first order',
    },
    {
      code: 'BIGSALE',
      discount: 200,
      description: '₹200 off on orders above ₹1000',
    },
  ];

  const handleApplyOffer = offer => {
    setAppliedOffer(prev => (prev?.code === offer.code ? null : offer));
  };

  // compute final total considering offer
  const finalTotal = useMemo(() => {
    if (!appliedOffer) return total;
    return Math.max(total - appliedOffer.discount, 0);
  }, [appliedOffer, total]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{paddingBottom: 100}}
        showsVerticalScrollIndicator={false}>
        <AddressSelector />

        {/* Multiple Stores and their items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>

          {storeGroups.length === 0 && (
            <Text style={{color: '#666', marginTop: 8}}>
              No items selected.
            </Text>
          )}

          {storeGroups.map(store => (
            <View key={store.store_id} style={styles.storeBlock}>
              <Text style={styles.storeName}>
                🏪 {store.store_name || `Store ${store.store_id}`}
              </Text>

              {Array.isArray(store.items) && store.items.length > 0 ? (
                store.items.map(item => (
                  <View key={item.cartId} style={styles.orderItem}>
                    <Image
                      source={
                        item.image
                          ? {uri: item.image}
                          : require('../../../sources/images/c1.png')
                      }
                      style={styles.itemImage}
                      resizeMode="cover"
                    />
                    <View style={styles.itemDetails}>
                      <Text style={styles.itemBrand}>{item.brand}</Text>
                      <Text style={styles.itemName}>{item.name}</Text>

                      <View style={styles.priceRow}>
                        <Text style={styles.priceText}>
                          {formatPrice(Number(item.price) || 0)}
                        </Text>
                        {item.originalPrice ? (
                          <Text style={styles.originalPrice}>
                            {formatPrice(Number(item.originalPrice))}
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
                ))
              ) : (
                <Text style={{color: '#888', marginLeft: 8}}>
                  No items in this store.
                </Text>
              )}
            </View>
          ))}
        </View>

        {/* Offers Section */}
        <OfferSection
          offers={offers}
          appliedOffer={appliedOffer}
          onApplyOffer={handleApplyOffer}
        />

        {/* Bill Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bill Details</Text>

          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Product Total</Text>
            <Text style={styles.billValue}>{formatPrice(subtotal)}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Delivery Partner Fee</Text>
            <Text style={styles.billValue}>{formatPrice(deliveryFee)}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>GST (5%)</Text>
            <Text style={styles.billValue}>{formatPrice(gst)}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Platform Fee</Text>
            <Text style={styles.billValue}>{formatPrice(platformFee)}</Text>
          </View>
          {appliedOffer && (
            <View style={styles.billRow}>
              <Text style={[styles.billLabel, {color: 'green'}]}>
                Offer Applied ({appliedOffer.code})
              </Text>
              <Text style={[styles.billValue, {color: 'green'}]}>
                -{formatPrice(appliedOffer.discount)}
              </Text>
            </View>
          )}
          <View style={[styles.billRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Bill</Text>
            <Text style={styles.totalValue}>{formatPrice(finalTotal)}</Text>
          </View>
        </View>
      </ScrollView>

      <CartSummary
        buttonText="Confirm & Pay"
        onConfirm={onNext}
      />
    </View>
  );
};

export default ReviewStep;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  scrollView: {flex: 1},
  section: {padding: 16, borderBottomWidth: 1, borderColor: '#eee'},
  sectionHeader: {flexDirection: 'row', justifyContent: 'space-between'},
  sectionTitle: {fontSize: 18, fontWeight: '600', color: '#222'},
  changeButton: {color: '#FF6B6B', fontWeight: '600'},
  addressText: {marginTop: 8, color: '#444', fontSize: 15},
  storeBlock: {
    marginTop: 12,
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingTop: 8,
  },
  storeName: {fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 4},
  orderItem: {flexDirection: 'row', marginVertical: 8},
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#f3f3f3',
  },
  itemDetails: {flex: 1, marginLeft: 10, justifyContent: 'center'},
  itemBrand: {fontSize: 14, fontWeight: '500', color: '#555'},
  itemName: {fontSize: 15, color: '#222'},
  priceRow: {flexDirection: 'row', alignItems: 'center', marginTop: 4},
  priceText: {fontSize: 15, fontWeight: '600', color: '#111'},
  originalPrice: {
    fontSize: 13,
    color: '#888',
    textDecorationLine: 'line-through',
    marginLeft: 6,
  },
  discountPill: {
    marginLeft: 6,
    backgroundColor: '#E8F8F5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  discountText: {fontSize: 12, fontWeight: '600', color: '#2ECC71'},
  itemMeta: {fontSize: 13, color: '#666', marginTop: 4},
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  billLabel: {fontSize: 15, color: '#444'},
  billValue: {fontSize: 15, fontWeight: '600', color: '#222'},
  totalRow: {
    borderTopWidth: 1,
    borderColor: '#ddd',
    marginTop: 8,
    paddingTop: 8,
  },
  totalLabel: {fontSize: 17, fontWeight: '700', color: '#000'},
  totalValue: {fontSize: 17, fontWeight: '700', color: '#000'},
});
