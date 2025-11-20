import React, {memo, useCallback} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Address} from './address';
import {setDefaultAddress} from '../../../../reduxSlices/addressesSlice';
import {AppDispatch} from '../../../../Store';
import {useDispatch} from 'react-redux';

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
  const dispatch = useDispatch<AppDispatch>();
  const handleEdit = useCallback(() => onEdit?.(address), [onEdit, address]);
  const handleDelete = useCallback(
    () => onDelete?.(address.id),
    [onDelete, address.id],
  );
  const handlePress = useCallback(() => {
    dispatch(setDefaultAddress(address.id));
    onPress?.(address);
  }, [dispatch, address, onPress]);

  // Render content (common structure)
  const renderContent = () => (
    <View style={styles.contentContainer}>
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
    </View>
  );

  // If selected, wrap with LinearGradient border
  if (isSelected) {
    return (
      <TouchableOpacity
        style={styles.cardWrapper}
        activeOpacity={0.8}
        onPress={handlePress}>
        <LinearGradient
          colors={['#FF5964', '#1877F2']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.gradientBorder}>
          <View style={styles.cardInner}>{renderContent()}</View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  // Default card (no gradient)
  return (
    <TouchableOpacity
      style={[styles.cardWrapper, styles.card]}
      activeOpacity={0.8}
      onPress={handlePress}>
      {renderContent()}
    </TouchableOpacity>
  );
};

export default memo(AddressCard);

const styles = StyleSheet.create({
  cardWrapper: {
    marginHorizontal: 10,
    marginBottom: 6,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  gradientBorder: {
    borderRadius: 12,
    padding: 2, // Border thickness
  },
  cardInner: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
  },
  contentContainer: {
    // No extra styles needed, just a wrapper
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



