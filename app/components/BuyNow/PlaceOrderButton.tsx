import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const PlaceOrderButton = ({ total }) => (
  <View style={styles.container}>
    <TouchableOpacity style={styles.button}>
      <Text style={styles.text}>Pay ₹{total}</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: { padding: 12, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#eee' },
  button: { backgroundColor: '#FF5964', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  text: { color: '#fff', fontWeight: '700', fontSize: 16 },
});

export default PlaceOrderButton;
