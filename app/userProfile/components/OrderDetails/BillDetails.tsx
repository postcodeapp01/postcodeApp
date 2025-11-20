
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface BillDetailsProps {
  subtotal: number;
  deliveryPartnerFee: number;
  deliveryFee: number;
  gstAndProductCharges: number;
  platformFee: number;
  totalBill: number;
}

const BillDetails: React.FC<BillDetailsProps> = ({
  subtotal,
  deliveryPartnerFee,
  deliveryFee,
  gstAndProductCharges,
  platformFee,
  totalBill,
}) => {
  const formatPrice = (price: number) => `₹ ${price.toFixed(0)}`;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Bill Details</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Products Total</Text>
        <Text style={styles.value}>{formatPrice(subtotal)}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Delivery partner fee</Text>
        <Text style={styles.value}>{formatPrice(deliveryPartnerFee)}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Delivery fee</Text>
        <Text style={styles.value}>{formatPrice(deliveryFee)}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>GST and product charges</Text>
        <Text style={styles.value}>{formatPrice(gstAndProductCharges)}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Platform fee</Text>
        <Text style={styles.value}>{formatPrice(platformFee)}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total Bill</Text>
        <Text style={styles.totalValue}>{formatPrice(totalBill)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
});

export default BillDetails;
