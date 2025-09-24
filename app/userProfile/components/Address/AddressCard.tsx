import React, {memo, useCallback} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Address} from './address';

type Props = {
  address: Address;
  isSelected?: boolean;
  onEdit?: (a: Address) => void;
  onDelete?: (id: string) => void;
  onPress?: (a: Address) => void; 
};

const AddressCard: React.FC<Props> = ({
  address,
  isSelected,
  onEdit,
  onDelete,
  onPress,
}) => {
  const handleEdit = useCallback(() => onEdit?.(address), [onEdit, address]);
  const handleDelete = useCallback(
    () => onDelete?.(address.id),
    [onDelete, address.id],
  );
  const handlePress = useCallback(() => onPress?.(address), [onPress, address]);

  return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.selectedCard]} // highlight selected
      activeOpacity={0.8}
      onPress={handlePress}>
      <Text style={styles.name}>{address.name}</Text>

      <Text style={styles.addressText}>
        {address.addressLine1}
        {address.addressLine2 ? `, ${address.addressLine2}` : ''},{' '}
        {address.city}, {address.state}.
      </Text>

      <Text style={styles.phoneText}>
        Phone: {address.phone || '9876543210'}
      </Text>

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={handleDelete}
          accessibilityLabel={`Delete ${address.label || address.name}`}
          style={styles.actionBtn}>
          <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
        </TouchableOpacity>

        <View style={styles.separator} />

        <TouchableOpacity
          onPress={handleEdit}
          accessibilityLabel={`Edit ${address.label || address.name}`}
          style={styles.actionBtn}>
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default memo(AddressCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 10,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedCard: {
    borderColor: 'green', // ✅ highlight border green
    borderWidth: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  addressText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 4,
  },
  phoneText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  deleteText: {
    color: '#FF3B30',
  },
  separator: {
    width: 1,
    height: 16,
    backgroundColor: '#000',
    marginHorizontal: 12,
  },
});
