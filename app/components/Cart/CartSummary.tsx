import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

interface CartSummaryProps {
  total: number;
  buttonText: string;
  onConfirm: () => void;
  disabled?: boolean;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  total,
  buttonText,
  onConfirm,
  disabled = false,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.confirmButton, disabled && styles.disabledButton]}
        onPress={onConfirm}
        disabled={disabled}
      >
        <Text style={[styles.buttonText, disabled && styles.disabledText]}>
          {buttonText}
        </Text>
        {/* <Text style={[styles.totalText, disabled && styles.disabledText]}>
          ₹ {total}
        </Text> */}
      </TouchableOpacity>
    </View>
  );
};

export default CartSummary;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    // paddingHorizontal: 16,
    // paddingVertical: 12,
    
   
  },
  confirmButton: {
    backgroundColor: '#FF5964',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    // borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  totalText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledText: {
    color: '#999',
  },
});
