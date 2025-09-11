import React, {memo, useCallback} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Address } from './address';

type Props = {
  address: Address;
  isDefault?: boolean;
  onEdit?: (a: Address) => void;
  onDelete?: (id: string) => void;
  onMarkDefault?: (id: string) => void;
  showMarkDefault?: boolean;
};

const AddressCard: React.FC<Props> = ({address, isDefault, onEdit, onDelete, onMarkDefault, showMarkDefault = true}) => {
  const handleEdit = useCallback(() => onEdit?.(address), [onEdit, address]);
  const handleDelete = useCallback(() => onDelete?.(address.id), [onDelete, address.id]);
  const handleMarkDefault = useCallback(() => onMarkDefault?.(address.id), [onMarkDefault, address.id]);

  return (
    <View style={styles.card}>
      <Text style={styles.name}>{address.name}</Text>
      
      <Text style={styles.addressText}>
        {address.addressLine1}{address.addressLine2 ? `, ${address.addressLine2}` : ''}, {address.city}, {address.state}.
      </Text>
      
      {/* <Text style={styles.addressText}>
        sai milk bar, {address.city}, {address.state}.
      </Text> */}
      
      <Text style={styles.phoneText}>
        Phone: {address.phone || '9876543210'}
      </Text>

      <View style={styles.actions}>
        <TouchableOpacity 
          onPress={handleDelete} 
          accessibilityLabel={`Delete ${address.label || address.name}`} 
          style={styles.actionBtn}
        >
          <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
        </TouchableOpacity>
        
        <View style={styles.separator} />
        
        <TouchableOpacity 
          onPress={handleEdit} 
          accessibilityLabel={`Edit ${address.label || address.name}`} 
          style={styles.actionBtn}
        >
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>

        {showMarkDefault && !isDefault && (
          <>
            <View style={styles.separator} />
            <TouchableOpacity 
              onPress={handleMarkDefault} 
              accessibilityLabel={`Mark ${address.label || address.name} default`} 
              style={styles.actionBtn}
            >
              <Text style={styles.actionText}>Mark default</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

export default memo(AddressCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
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
