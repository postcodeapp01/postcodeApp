import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BillDetails = ({ bill }) => (
  <View style={styles.container}>
    <Text style={styles.title}>Bill Details</Text>
    
    <View style={styles.billRow}>
      <Text style={styles.label}>Product Total</Text>
      <Text style={styles.amount}>₹ {bill.productTotal}</Text>
    </View>
    
    <View style={styles.billRow}>
      <Text style={styles.label}>Delivery partner fee</Text>
      <Text style={styles.amount}>₹ {bill.deliveryFee}</Text>
    </View>
    
    <View style={styles.billRow}>
      <Text style={styles.label}>GST and product charges</Text>
      <Text style={styles.amount}>₹ {bill.gst}</Text>
    </View>
    
    <View style={styles.billRow}>
      <Text style={styles.label}>Platform fee</Text>
      <Text style={styles.amount}>₹ {bill.platformFee}</Text>
    </View>
    
    <View style={styles.separator} />
    
    <View style={styles.totalRow}>
      <Text style={styles.totalLabel}>Total Bill</Text>
      <Text style={styles.totalAmount}>₹ {bill.total}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    height:206,
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 15,
    letterSpacing:-0.32,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: '#000000',
    flex: 1,
    letterSpacing:-0.32,
  },
  amount: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '400',
    letterSpacing:-0.32,
  },
  separator: {
    height: 1,
    backgroundColor: 'transparent',
    borderTopWidth: 2,
    borderTopColor: '#AAAAAA',
    borderStyle: 'dotted',
    // marginVertical: 1,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
   
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    letterSpacing:-0.32,
    lineHeight:20,
  },
  totalAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    letterSpacing:-0.32,
    lineHeight:20,
  },
});

export default BillDetails;
