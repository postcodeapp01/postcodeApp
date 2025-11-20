import React, {useCallback} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {selectDefaultAddress} from '../../../../reduxSlices/addressesSlice';
import type {RootState} from '../../../../Store';

interface Props {
  containerStyle?: object;
}

const AddressSelector: React.FC<Props> = ({containerStyle}) => {
  const navigation = useNavigation<any>();
  const defaultAddress = useSelector((state: RootState) =>
    selectDefaultAddress(state),
  );

  const handleChangeAddress = useCallback(() => {
    navigation.navigate('ProfileTab', {screen: 'AddressScreen'});
  }, [navigation]);

  if (!defaultAddress) {
    return (
      <View style={[styles.container, containerStyle]}>
        <View style={styles.headerRow}>
          <Ionicons name="home-outline" size={18} color="#1EA34A" />
          <Text style={styles.noAddressText}>No address found</Text>
        </View>
        <TouchableOpacity
          style={styles.changeButton}
          onPress={handleChangeAddress}>
          <Text style={styles.changeText}>Add Address</Text>
          <Ionicons name="chevron-forward" size={14} color="#E53E3E" />
        </TouchableOpacity>
      </View>
    );
  }
  const addressParts = [
    defaultAddress.addressLine1,
    defaultAddress.addressLine2,
    defaultAddress.city,
    defaultAddress.state,
    defaultAddress.pincode,
  ].filter(Boolean);

  const fullAddress = addressParts.join(', ');
  return (
    <View style={[styles.container, containerStyle]}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <Ionicons name="home" size={14} color="#34A853" />
        <Text>
          <Text style={styles.labelText}> {defaultAddress.label}</Text>
          <Text style={styles.separator}> | </Text>
          <Text style={styles.nameText}>{defaultAddress.name || 'User'}</Text>
        </Text>
      </View>

      {/* Address Text */}
      <Text style={styles.addressText}>{fullAddress}</Text>

      {/* Phone Number */}
      {defaultAddress.phone && (
        <Text style={styles.phoneText}>{defaultAddress.phone}</Text>
      )}

      {/* Change Address Button */}
      <TouchableOpacity
        style={styles.changeButton}
        onPress={handleChangeAddress}
        activeOpacity={0.7}>
        <Text style={styles.changeText}>Change Address</Text>
        <Ionicons name="chevron-forward" size={14} color="#E53E3E" />
      </TouchableOpacity>
    </View>
  );
};

export default AddressSelector;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  labelText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#34A853',
    marginLeft: 8,
    lineHeight:20,
    letterSpacing:0.1,
  },
  separator: {
    color: '#AAAAAA',
    fontWeight: '400',
  },
  nameText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#222',
    lineHeight:20,
    letterSpacing:0.1,
  },
  addressText: {
    fontSize: 12,
    color: '#222',
    // marginBottom: 4,
    lineHeight:20,
    letterSpacing:0.1,
    fontWeight: '400',
  },
  phoneText: {
    fontSize: 14,
    color: '#222',
    fontWeight: '400',
    lineHeight:20,
    letterSpacing:0.1,
    // marginBottom: 8,
  },
  changeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  changeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#E53E3E',
    marginRight: 4,
  },
  noAddressText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    fontWeight: '400',
  },
});
