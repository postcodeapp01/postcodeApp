import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';

const PaymentSection = ({totalAmount = 415}) => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  const paymentMethods = [
    {name: 'Google pay', icon: require('../../../../sources/images/gpay.png')},
    {name: 'Phonepe', icon: require('../../../../sources/images/gpay.png')},
    {
      name: 'Cash On Delivery',
      icon: require('../../../../sources/images/gpay.png'),
    },
  ];

  const selectedMethod = paymentMethods[selectedIdx];

  return (
    <View style={styles.container}>
      {/* Main header (unchanged UI) */}
      <View style={styles.header}>
        <Text style={styles.title}>Select a payment method</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={styles.moreOptions}>More options</Text>
        </TouchableOpacity>
      </View>

      {/* Selected payment UI (unchanged) */}
      <View style={styles.selectedMethodContainer}>
        <Image source={selectedMethod.icon} style={styles.selectedIcon} />
        <View style={styles.selectedInfo}>
          <Text style={styles.selectedMethodName}>{selectedMethod.name}</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={styles.changePayment}>Change payment ▼</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.payButton}>
          <Text style={styles.payButtonText}>Pay ₹ {totalAmount}</Text>
        </TouchableOpacity>
      </View>

      {/* Modal: appears when user taps "Change payment" / "More options" */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>

        <View style={styles.modalContent}>
          {/* Payment method list (same rows/styles as before) */}
          {paymentMethods.map((method, idx) => (
            <TouchableOpacity
              key={method.name}
              style={styles.methodRow}
              onPress={() => {
                setSelectedIdx(idx);
                setModalVisible(false);
              }}>
              <View style={styles.methodLeft}>
                <View style={styles.radioOuter}>
                  {selectedIdx === idx && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.methodText}>{method.name}</Text>
              </View>
              <Image source={method.icon} style={styles.methodIcon} />
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 100,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 20,
    // marginBottom: 8,
    gap: 10,
  },
  header: {
    height: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginBottom: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    lineHeight: 20,
    letterSpacing: -0.32,
    left: 8,
  },
  moreOptions: {
    fontSize: 14,
    color: '#0072F0',
    fontWeight: '500',
    lineHeight: 20,
    letterSpacing: -0.32,
    right: 10,
  },
  backText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  selectedMethodContainer: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  selectedIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 16,
  },
  selectedInfo: {
    flex: 1,
  },
  selectedMethodName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    lineHeight: 20,
    letterSpacing: -0.32,
  },
  changePayment: {
    fontSize: 12,
    color: '#B1B1B1',
    fontWeight: '500',
    lineHeight: 20,
    letterSpacing: -0.32,
  },
  
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom:20,
  },
  methodLeft: {
  flexDirection: 'row',
  alignItems: 'center',
},
  radioOuter: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#FF5964',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  radioInner: {
    width: 10,
    height: 10,
    backgroundColor: '#FF5964',
    borderRadius: 5,
  },
  methodIcon: {
    width: 40,
    height: 40,
    borderRadius: 16,
    marginRight: 16,
  },
  methodText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  payButton: {
    height: 40,
    width: 150,
    backgroundColor: '#FF5964',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 15,
    letterSpacing: -0.32,
  },

  /* Modal-specific styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 10,
    paddingTop: 12,
    paddingBottom: 24,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    // ensure it slides up from bottom
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalPayButton: {
    alignSelf: 'center',
    marginTop: 8,
    width: 200,
  },
});

export default PaymentSection;
