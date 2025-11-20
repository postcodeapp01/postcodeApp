
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface OrderStatusCardProps {
  orderStatus: string;
  orderId: string;
  orderDate: string;
}

const OrderStatusCard: React.FC<OrderStatusCardProps> = ({
  orderStatus,
  orderId,
  orderDate,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.statusSection}>
          <Text style={styles.label}>Your order is</Text>
          <Text style={styles.statusText}>{orderStatus}</Text>
        </View>
        <View style={styles.dateSection}>
          <Text style={styles.dateText}>{orderDate}</Text>
        </View>
      </View>
      <View style={styles.orderIdRow}>
        <Text style={styles.orderIdLabel}>Order ID</Text>
        <Text style={styles.orderIdValue}>#{orderId}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  statusSection: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF6B00',
    textTransform: 'uppercase',
  },
  dateSection: {
    alignItems: 'flex-end',
  },
  dateText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  orderIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  orderIdLabel: {
    fontSize: 13,
    color: '#666',
  },
  orderIdValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
});

export default OrderStatusCard;
