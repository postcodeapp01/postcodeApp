import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CartSummary from './CartSummary';
import { CartData } from '../../screens/CartScreen';

interface PaymentStepProps {
  cartData: CartData;
  onPaymentMethodChange: (method: string) => void;
  onComplete: () => void;
}

const PaymentStep: React.FC<PaymentStepProps> = ({
  cartData,
  onPaymentMethodChange,
  onComplete,
}) => {
  const [selectedPayment, setSelectedPayment] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [netBank, setNetBank] = useState('');

  const paymentMethods = [
    { id: 'card', label: 'Credit / Debit / ATM Card', icon: 'credit-card' },
    { id: 'netbanking', label: 'Net Banking', icon: 'account-balance' },
    { id: 'upi', label: 'UPI', icon: 'payment' },
    { id: 'cod', label: 'Cash on Delivery', icon: 'local-shipping' },
  ];

  const handlePaymentSelect = (methodId: string) => {
    setSelectedPayment(methodId);
    onPaymentMethodChange(methodId);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment</Text>

          {paymentMethods.map((method) => (
            <View key={method.id}>
              <TouchableOpacity
                style={[
                  styles.paymentOption,
                  selectedPayment === method.id && styles.selectedOption,
                ]}
                onPress={() => handlePaymentSelect(method.id)}
              >
                <Icon name={method.icon} size={24} color="#666" />
                <Text style={styles.paymentLabel}>{method.label}</Text>
                <View style={styles.radioContainer}>
                  {selectedPayment === method.id ? (
                    <Icon name="radio-button-checked" size={20} color="#FF6B6B" />
                  ) : (
                    <Icon name="radio-button-unchecked" size={20} color="#ccc" />
                  )}
                </View>
              </TouchableOpacity>

              {/* Expand forms below each option */}
              {selectedPayment === 'card' && method.id === 'card' && (
                <View style={styles.cardForm}>
                  <Text style={styles.formTitle}>Card Details</Text>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Card Number</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="XXXX XXXX XXXX XXXX"
                      value={cardNumber}
                      onChangeText={setCardNumber}
                      keyboardType="numeric"
                      maxLength={19}
                    />
                  </View>

                  <View style={styles.rowContainer}>
                    <View style={styles.halfInput}>
                      <Text style={styles.inputLabel}>Valid Thru</Text>
                      <TextInput
                        style={styles.textInput}
                        placeholder="MM / YY"
                        value={expiryDate}
                        onChangeText={setExpiryDate}
                        keyboardType="numeric"
                        maxLength={5}
                      />
                    </View>
                    <View style={styles.halfInput}>
                      <Text style={styles.inputLabel}>CVV</Text>
                      <TextInput
                        style={styles.textInput}
                        placeholder="CVV"
                        value={cvv}
                        onChangeText={setCvv}
                        keyboardType="numeric"
                        maxLength={3}
                        secureTextEntry
                      />
                    </View>
                  </View>
                </View>
              )}

              {selectedPayment === 'netbanking' && method.id === 'netbanking' && (
                <View style={styles.cardForm}>
                  <Text style={styles.formTitle}>Net Banking</Text>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Bank Name</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Enter Bank Name"
                      value={netBank}
                      onChangeText={setNetBank}
                    />
                  </View>
                </View>
              )}

              {selectedPayment === 'upi' && method.id === 'upi' && (
                <View style={styles.cardForm}>
                  <Text style={styles.formTitle}>UPI Details</Text>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>UPI ID</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="example@upi"
                      value={upiId}
                      onChangeText={setUpiId}
                      keyboardType="email-address"
                    />
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Gift Card Section */}
        <View style={styles.section}>
          <View style={styles.giftCardContainer}>
            <Icon name="card-giftcard" size={20} color="#666" />
            <Text style={styles.giftCardText}>Have a Gift Card?</Text>
            <TouchableOpacity>
              <Text style={styles.addButton}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <CartSummary
        total={cartData.total}
        buttonText="Proceed to Payment"
        onConfirm={onComplete}
        disabled={!selectedPayment}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollView: { flex: 1 },
  section: { paddingHorizontal: 16, paddingVertical: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#eee',
  },
  selectedOption: { backgroundColor: '#fafafa' },
  paymentLabel: { flex: 1, marginLeft: 12, fontSize: 15, color: '#333' },
  radioContainer: { marginLeft: 8 },
  cardForm: { paddingVertical: 12, paddingLeft: 36 },
  formTitle: { fontWeight: '600', marginBottom: 8 },
  inputContainer: { marginBottom: 12 },
  inputLabel: { fontSize: 13, color: '#555', marginBottom: 4 },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
  },
  rowContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  halfInput: { flex: 1, marginRight: 8 },
  giftCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  giftCardText: { flex: 1, marginLeft: 8, fontSize: 14, color: '#333' },
  addButton: { color: '#FF6B6B', fontWeight: '600' },
});

export default PaymentStep;


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   scrollView: {
//     flex: 1,
//     paddingBottom: 120,
//   },
//   section: {
//     backgroundColor: '#fff',
//     marginVertical: 4,
//     padding: 16,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#000',
//     marginBottom: 16,
//   },
//   paymentOption: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   selectedOption: {
//     backgroundColor: '#fef7f7',
//     marginHorizontal: -16,
//     paddingHorizontal: 16,
//   },
//   paymentLabel: {
//     flex: 1,
//     fontSize: 14,
//     color: '#000',
//     marginLeft: 12,
//   },
//   radioContainer: {
//     marginLeft: 12,
//   },
//   cardForm: {
//     marginTop: 16,
//     padding: 16,
//     backgroundColor: '#f9f9f9',
//     borderRadius: 8,
//   },
//   formTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 16,
//     color: '#000',
//   },
//   inputContainer: {
//     marginBottom: 16,
//   },
//   inputLabel: {
//     fontSize: 12,
//     color: '#666',
//     marginBottom: 8,
//   },
//   textInput: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     paddingVertical: 12,
//     fontSize: 14,
//     backgroundColor: '#fff',
//   },
//   rowContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   halfInput: {
//     flex: 0.48,
//   },
  
//   giftCardContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 8,
//   },
//   giftCardText: {
//     flex: 1,
//     fontSize: 14,
//     color: '#000',
//     marginLeft: 12,
//   },
//   addButton: {
//     fontSize: 14,
//     color: '#FF6B6B',
//     fontWeight: '600',
//   },
// });
