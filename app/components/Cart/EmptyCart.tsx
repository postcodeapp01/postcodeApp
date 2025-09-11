// src/components/cart/EmptyCart.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const EmptyCart: React.FC = () => {
  return (
    <View style={styles.center}>
      <Text style={styles.title}>Your cart is empty</Text>
      <Text style={styles.sub}>Add items to see them here.</Text>
    </View>
  );
};

export default EmptyCart;

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 6 },
  sub: { fontSize: 14, color: '#777' },
});
