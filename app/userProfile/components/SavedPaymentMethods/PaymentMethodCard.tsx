// components/payment/PaymentMethodCard.tsx
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export interface PaymentMethod {
  id: string;
  type: 'credit' | 'debit' | 'upi' | 'wallet';
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  bankName: string;
  isDefault?: boolean;
}

interface Props {
  method: PaymentMethod;
  onEdit: () => void;
  onSetDefault: () => void;
  onDelete: () => void;
}

const PaymentMethodCard: React.FC<Props> = ({
  method,
  onEdit,
  onSetDefault,
  onDelete,
}) => {
  const getCardIcon = () => {
    switch (method.type) {
      case 'credit':
      case 'debit':
        return 'credit-card';
      case 'upi':
        return 'qrcode';
      case 'wallet':
        return 'wallet';
      default:
        return 'credit-card';
    }
  };

  const getCardColor = () => {
    switch (method.type) {
      case 'credit':
        return '#4A90E2';
      case 'debit':
        return '#FF6B6B';
      case 'upi':
        return '#FFB347';
      case 'wallet':
        return '#50C878';
      default:
        return '#999';
    }
  };

  return (
    <View style={styles.card}>
      {/* Card Header */}
      <View style={styles.cardHeader}>
        <View style={styles.cardInfo}>
          <View
            style={[
              styles.cardIcon,
              {backgroundColor: getCardColor() + '20'},
            ]}>
            <MaterialCommunityIcons
              name={getCardIcon()}
              size={24}
              color={getCardColor()}
            />
          </View>
          <View style={styles.cardDetails}>
            <Text style={styles.bankName}>{method.bankName}</Text>
            <Text style={styles.cardNumber}>{method.cardNumber}</Text>
          </View>
        </View>
        {method.isDefault && (
          <View style={styles.defaultBadge}>
            <Text style={styles.defaultText}>Default</Text>
          </View>
        )}
      </View>

      {/* Expiry Info */}
      <View style={styles.expirySection}>
        <View>
          <Text style={styles.expiryLabel}>Expires</Text>
          <Text style={styles.expiryDate}>{method.expiryDate}</Text>
        </View>
        <View>
          <Text style={styles.holderLabel}>Card Holder</Text>
          <Text style={styles.holderName}>{method.cardHolder}</Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        {!method.isDefault && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onSetDefault}
            activeOpacity={0.7}>
            <Text style={styles.actionText}>Set Default</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onEdit}
          activeOpacity={0.7}>
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={onDelete}
          activeOpacity={0.7}>
          <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardIcon: {
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardDetails: {
    flex: 1,
  },
  bankName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  cardNumber: {
    fontSize: 12,
    color: '#666',
  },
  defaultBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#16A34A',
  },
  expirySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F0F0F0',
    marginBottom: 12,
  },
  expiryLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 3,
  },
  expiryDate: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  holderLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 3,
  },
  holderName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  deleteButton: {
    backgroundColor: '#FFF5F5',
  },
  deleteText: {
    color: '#FF6B6B',
  },
});

export default PaymentMethodCard;
