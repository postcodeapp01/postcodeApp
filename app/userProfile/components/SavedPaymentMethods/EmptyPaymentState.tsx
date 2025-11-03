// components/payment/EmptyPaymentState.tsx
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props {
  onAddPayment: () => void;
}

const EmptyPaymentState: React.FC<Props> = ({onAddPayment}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          name="credit-card-off-outline"
          size={64}
          color="#CCC"
        />
      </View>
      <Text style={styles.title}>No Payment Methods</Text>
      <Text style={styles.message}>
        Add a payment method to make checkout faster and easier.
      </Text>
      <TouchableOpacity style={styles.button} onPress={onAddPayment}>
        <Text style={styles.buttonText}>Add Payment Method</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
});

export default EmptyPaymentState;
