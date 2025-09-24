import React, {useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CartSummary from './CartSummary';
import {CartData} from '../../screens/CartScreen';
import axiosInstance from '../../../config/Api';
import { useNavigation } from '@react-navigation/native';

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
  const navigation = useNavigation();
  const [selectedPayment, setSelectedPayment] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [netBank, setNetBank] = useState('');

  const paymentMethods = [
    {id: 'card', label: 'Credit / Debit / ATM Card', icon: 'credit-card'},
    {id: 'netbanking', label: 'Net Banking', icon: 'account-balance'},
    {id: 'upi', label: 'UPI', icon: 'payment'},
    {id: 'cod', label: 'Cash on Delivery', icon: 'local-shipping'},
  ];

  const handlePaymentSelect = (methodId: string) => {
    setSelectedPayment(methodId);
    onPaymentMethodChange(methodId);
  };
  const handleProceed = async () => {
    if (!selectedPayment) {
      Alert.alert('Select payment', 'Please select a payment method');
      return;
    }
    console.log(selectedPayment);
    try {
      setIsProcessing(true);
      const items = (cartData.items || []).map((it: any) => ({
        product_id: it.productId,
        product_name: it.name,
        quantity: it.qty,
        price: it.price ?? 0,
        discount: it.discount ?? 0,
      }));

      const payload = {
        items,
        subtotal:
          cartData.subtotal ??
          items.reduce((s: any, it: any) => s + it.price * it.quantity, 0),
        discount: 0,
        tax: 0,
        shipping_fee: 40,
        grand_total: cartData.total ?? 0,
        payment_method: selectedPayment,
        shipping_address_id: 'e5937ba8-9472-11f0-8c40-06b20f833363',
        billing_address_id: 'b6a30719-953b-11f0-8c40-06b20f833363',
        notes: null,
        metadata: {simulated: true},
      };

      const res = await axiosInstance.post(`/orders`, payload);

      const data = await res.data;
      console.log('response after creating the orders', data);
      if (!res.data) {
        console.error('Order creation failed', data);
        Alert.alert('Error', data.error || 'Failed to create order');
        setIsProcessing(false);
        return;
      }

      setIsProcessing(false);

      onComplete?.(data);

      navigation.navigate('PaymentSuccess', {
        transactionId: data.transaction_id,
        paymentMethod: data.payment_method,
        dateTime: data.placed_at,
        amount: data.amount_paid,
        orderId: data.order_number,
        orderItems: data.order_items,
      });
    } catch (err: any) {
      console.error(err);
      setIsProcessing(false);
      Alert.alert('Error', err.message || 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment</Text>

          {paymentMethods.map(method => (
            <View key={method.id}>
              <TouchableOpacity
                style={[
                  styles.paymentOption,
                  selectedPayment === method.id && styles.selectedOption,
                ]}
                onPress={() => handlePaymentSelect(method.id)}>
                <Icon name={method.icon} size={24} color="#666" />
                <Text style={styles.paymentLabel}>{method.label}</Text>
                <View style={styles.radioContainer}>
                  {selectedPayment === method.id ? (
                    <Icon
                      name="radio-button-checked"
                      size={20}
                      color="#FF6B6B"
                    />
                  ) : (
                    <Icon
                      name="radio-button-unchecked"
                      size={20}
                      color="#ccc"
                    />
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

              {selectedPayment === 'netbanking' &&
                method.id === 'netbanking' && (
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
        onConfirm={handleProceed}
        disabled={!selectedPayment}
      />
    </View>
  );
};
export default PaymentStep;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  scrollView: {flex: 1},
  section: {paddingHorizontal: 16, paddingVertical: 12},
  sectionTitle: {fontSize: 16, fontWeight: '600', marginBottom: 12},
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#eee',
  },
  selectedOption: {backgroundColor: '#fafafa'},
  paymentLabel: {flex: 1, marginLeft: 12, fontSize: 15, color: '#333'},
  radioContainer: {marginLeft: 8},
  cardForm: {paddingVertical: 12, paddingLeft: 36},
  formTitle: {fontWeight: '600', marginBottom: 8},
  inputContainer: {marginBottom: 12},
  inputLabel: {fontSize: 13, color: '#555', marginBottom: 4},
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
  },
  rowContainer: {flexDirection: 'row', justifyContent: 'space-between'},
  halfInput: {flex: 1, marginRight: 8},
  giftCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  giftCardText: {flex: 1, marginLeft: 8, fontSize: 14, color: '#333'},
  addButton: {color: '#FF6B6B', fontWeight: '600'},
});
